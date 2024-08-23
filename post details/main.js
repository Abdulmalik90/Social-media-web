

// delete the col-7 and add col-12 from the post details if the page width less than 768px
function responsivePostPage() {
    if (window.innerWidth < 768) {
        let postDetails = document.getElementById("thePost")
    postDetails.classList.remove("col-7")
    postDetails.classList.add("col-12")
    postDetails.classList.add("mb-5")
    }
}

const urlParams = new URLSearchParams(window.location.search);
const id =urlParams.get("id")
console.log(id)

function getSpecificPost(id){
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response)=>{
        console.log(response)
        let post = response.data.data
        let userAndImg = document.getElementById("img-and-user")
        let title = document.getElementById("post-title")
        let body = document.getElementById("post-body")
        let image = document.getElementById("postImg")
        let time = document.getElementById("post-time")
        let comments_count = document.getElementById("comments-count")
        let usernamePageName = document.getElementById("username-page")
        let comments = post.comments
        let commentsDiv = document.getElementById("body-comments")
        console.log(comments)

        if (String(post.title) == "null"){
            post.title = ""
        }
        if (String(post.body) == "null"){
            post.body = ""
        }
        if (String(post.author.profile_image) == "[object Object]"){
            post.author.profile_image = "https://images.tarmeezacademy.com/users/7qBV10OKTipdMye.jpg"
        }

        // post details
        usernamePageName.innerHTML = `${post.author.name}`
        userAndImg.innerHTML = ` 
            <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="" style="width: 30px; height: 30px;">
            <b>@</b>${post.author.username}
        `
        title.innerHTML = `${post.title}`
        body.innerHTML = `${post.body}`
        image.innerHTML = `<img src="${post.image}" alt="" style="width: 100% !important; max-height: 2000px !important; max-width: 2000px !important;">`
        time.innerHTML = `${post.created_at}`
        comments_count.innerHTML = `${post.comments_count}`

        let tagsDiv = document.getElementById("post-tags-div")
        tagsDiv.innerHTML = ``
        let tags = post.tags
        for (tag of tags){
            tagsDiv.innerHTML += `<button style="background-color: gray; color: white; border: none; border-radius: 10px">${tag}</button>`
        }

        

        // comments details
        commentsDiv.innerHTML = ``
        for (comment of comments){
            if (String(comment.author.profile_image) == "[object Object]"){
                comment.author.profile_image = "https://images.tarmeezacademy.com/users/7qBV10OKTipdMye.jpg"
            }
            commentsDiv.innerHTML += `
                <div id="mainComments">
                    <!-- head comment -->
                    <div class="head-comment" style="display: flex; margin-left: 10px; margin-right: 10px; font-size: 12px;">
                        <div class="img-username">
                            <img class="rounded-circle border border-2" src="${comment.author.profile_image}" alt="profile image" style="width: 20px; height: 20px;">
                            <b>@</b>${comment.author.username}
                        </div>
                    </div>
                    <!-- // head comment // -->

                    <!--  comment body -->
                    <div class="main-comment" style="margin-left: 10px; margin-right: 10px; margin-top: 5px; border-bottom: 1px white solid;">
                        <h6 style="text-align: left; color: aliceblue;">${comment.body}</h6>
                    </div>
                    <!-- // comment body // -->
                </div>
            `
        
        }
    })
}

function createComment(id){
    let token = localStorage.getItem("token")
    let comment = document.getElementById("comment-area").value
    if (comment == ""){
        let alertSuccess = document.getElementById("alert-sign-log")
        alertSuccess.classList.remove("alert-success")
        alertSuccess.classList.add("alert-danger")
        alertSuccess.innerHTML = `<button type="button" id="close-alert" class="btn-close" aria-label="Close" onclick="hideAlert()"></button>  Please enter a comment!!`
        alertSuccess.style.display = "block"
        setTimeout(()=>{
            alertSuccess.style.display = "none"
        }, 10000)
        return
    }
    if (token == null){
        let alertSuccess = document.getElementById("alert-sign-log")
        alertSuccess.classList.remove("alert-success")
        alertSuccess.classList.add("alert-danger")
        alertSuccess.innerHTML = `<button type="button" id="close-alert" class="btn-close" aria-label="Close" onclick="hideAlert()"></button>  Please login or signIn first!!`
        alertSuccess.style.display = "block"
        setTimeout(()=>{
            alertSuccess.style.display = "none"
        }, 10000)
        return
    }
    let formData = new FormData()
    formData.append("body", comment)
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`, formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
    .then((response)=>{
        getSpecificPost(id)
    })
}
document.getElementById("send-comment").addEventListener("click", ()=>{
    createComment(id)
})

responsivePostPage()
window.addEventListener("resize", responsivePostPage())
getSpecificPost(id)