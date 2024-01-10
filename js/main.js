const container = document.querySelector("#postsContainer");
const addpostbtn = document.querySelector('#addPost');
addpostbtn.addEventListener('click',(e)=>{
    const title = document.querySelector('#exampleFormControlInput1').value
    const body = document.querySelector('#exampleFormControlTextarea1').value
    addPost(title,body)
})

function createComment(commentObject) {
  const { name, body } = commentObject;
  const comment = document.createElement("div");
  comment.classList.add("comment", "p-4", "rounded-5", "m-5", "border");
  comment.innerHTML = `

    <h6 class="comment-author border-bottom mb-2 pb-1"> <img src="./images/man.png"> ${name} </h6>
    <p class="comment-body ps-3">${body}</p>

    `;
  comment.setAttribute("title", "press (Alt + click) to delete comment");
  comment.addEventListener("click", (e) => {
    // console.log(e);
    if (e.altKey) {
      e.target.closest(".comment").remove();
    }
  });
  return comment;
}

function addComment(postId) {
  const commentsContainer = document.querySelector(
    `div[post-id = "${postId}"]`
  ).lastElementChild;

  const commentObject = {
    postId: postId,
    name: "Mohamed Fowzey",
    body: commentsContainer.firstElementChild.firstElementChild
      .firstElementChild.value,
  };

  commentsContainer.appendChild(createComment(commentObject));
}

async function showComments(postId) {
  console.log(postId);
  const postTarget = document.querySelector(`div[post-id = "${postId}"]`);
  const commentbtn =
    postTarget.firstElementChild.lastElementChild.firstElementChild
      .nextElementSibling;
  // console.log(commentbtn)
  if (commentbtn.classList.contains("first-click")) {
    const Comments = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    const arrayOfComments = await Comments.json();
    postTarget.lastElementChild.innerHTML = "";
    postTarget.lastElementChild.innerHTML = `<div class="row add-comment">
  <div class="col-auto">
    <input type="text" class="form-control" id="addComment" placeholder="add comment">
  </div>
  <div class="col-auto">
    <button type="button" class="btn btn-primary mb-3" onclick = "addComment(${postId})">add</button>
  </div>
</div>`;
    arrayOfComments.forEach((comment) => {
      postTarget.lastElementChild.appendChild(createComment(comment));
    });
    postTarget.lastElementChild.classList.toggle("hide");
    commentbtn.classList.remove("first-click");
  } else {
    postTarget.lastElementChild.classList.toggle("hide");
  }
}

function like(postId) {
  const postTarget = document.querySelector(`div[post-id = "${postId}"]`);
  postTarget.toggleAttribute("liked");
}

function createPost(postObject) {
  const { userId, id, body } = postObject;
  const post = document.createElement("div");
  post.classList.add("card", "w-50", "mx-auto", "my-4");
  post.innerHTML = `

  <div class="card-body text-center">
    <h5 class="card-title ms-auto">user ${userId} <img src="./images/man.png" alt=""></h5>
    <p class="card-text p-5">${body}</p>
    <div class="d-flex justify-content-around border-top">     
        <span class="btn ">share</span>
        <span class="btn first-click commentbtn" onclick = "showComments(${id})">comment</span>
        <button type="button" class="btn " onclick = "like(${id})" >like</button>
    </div>
  </div>

  `;
  post.setAttribute("post-id", id);
  const commentsContainer = document.createElement("div");
  commentsContainer.classList.add("comments-container", "border-top", "hide");

  post.appendChild(commentsContainer);
  post.addEventListener("click", (e) => {
    // console.log(e);
    if (e.altKey) {
      e.target.closest(".card").remove();
    }
  });
  return post;
}

function addPost(title, body) {
    if(!title || !body){
        alert("you can't add a post without a body or a title")
        return
    }
  const postObject = { userId: title, body: body };
  container.appendChild(createPost(postObject));
}


// addpostbtn.addEventListener('click',(e)=>{
//     
// })

(async () => {
  try {
    container.innerHTML = '<h6 class = "text-center">loading...</h6>';
    const posts = await fetch("https://jsonplaceholder.typicode.com/posts");
    const arrayOfPosts = await posts.json();
    container.innerHTML = "";
    arrayOfPosts.forEach((post) => {
      container.appendChild(createPost(post));
    });
  } catch (err) {
    console.log(err);
    container.innerHTML = `<h6 class = "text-center">faild to get the data, please check your conection and try again</h6>`;
  }
})();
