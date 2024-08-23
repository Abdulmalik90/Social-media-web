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

        if (String(post.title) == "null"){
            post.title = ""
        }
        if (String(post.body) == "null"){
            post.body = ""
        }
        if (String(post.author.profile_image) == "[object Object]"){
            post.author.profile_image = "https://images.tarmeezacademy.com/users/7qBV10OKTipdMye.jpg"
        }

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
    })
}

responsivePostPage()
window.addEventListener("resize", responsivePostPage())
getSpecificPost(id)