let urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("id")
console.log(id)

function getSpecificUser(id) {

    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response)=>{
        let user = response.data.data
        

        let nameOfUser = document.getElementById("nameOfUser")
        nameOfUser.innerHTML = `${user.name}`

        // user image
        if (String(user.profile_image) != "[object Object]"){
            let userImage = document.getElementById("userImage")
            userImage.src = `${user.profile_image}`
        } 
        // user image //

        let userName = document.getElementById("userName-h3")
        userName.innerHTML = `${user.username}`

        let postValue = document.getElementById("postsValue")
        postValue.innerHTML = `${user.posts_count}`
        
        let commentsValue = document.getElementById("commentsValue")
        commentsValue.innerHTML = `${user.comments_count}`

    })
}

function getUserPosts(id){
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then((response)=>{
        let posts = response.data.data
        

        let postsDiv = document.getElementById("posts-flex-container")



        
        for (post of posts){
            if (String(post.title) == "null"){
                post.title = ""
            }
            if (String(post.body) == "null"){
                post.body = ""
            }
            if (String(post.author.profile_image) == "[object Object]"){
                post.author.profile_image = "https://images.tarmeezacademy.com/users/7qBV10OKTipdMye.jpg"
            }

            //show or hide button user
            let user = getCurrentUser()
            let isMyPost = user != null && user.id == post.author.id
            let BtnContent = ""
            if (isMyPost){
                BtnContent = `<button class="btn btn-secondary edit-post-button" data-bs-toggle="modal" data-bs-target="#edit-post-modal" Onclick="editPostClicked('${encodeURIComponent(JSON.stringify(post))}')" style="width: 55px; font-size: 12px; display: inline-block;">Edit</button>`
            }

            
            
            
            postsDiv.innerHTML += `
            <div class="card mb-3">
                <div class="card-header" style="border-bottom: 0.1px white solid; display: flex; justify-content: space-between;">
                        <div onclick="openProfile(${post.author.id})" style="cursor: pointer;" id="user-div-info">
                            <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="" style="width: 30px; height: 30px;">
                            <b>@${post.author.username}</b>
                        </div>

                        ${BtnContent}
                    
                    

                </div>
                
                <div class="img mt-1">
                    <img src="${post.image}" alt="" style="width: 100%; max-height: 200px; max-width: 2000px;">
                </div>
                <div class="card-time">
                    <h6 class="mx-3 mt-2 pt-0" style="color: rgb(155, 155, 155);">${post.created_at}</h6>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-text">${post.body}</p>

                </div>
                <div class="container mb-3" style="display: flex; justify-content: space-between; cursor: pointer; border-top: 0.1px white solid;" onclick="openComments(${post.id})">
                    <div style="margin-left: 5px; margin-right: 5px; margin-top: 10px">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16" style="cursor: pointer; margin-right:10px">
                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                        </svg>
                        
                        <h5 style="font-weight: 100; display: inline;">(${post.comments_count}) Comments</h5>
                    </div>
                    
                    <div id="post-tags-div${post.id}">
                        <button style="background-color: gray; color: white; border: none; border-radius: 10px">hello world </button>
                    </div>
                </div>
            </div>
            `
            let post_tags_div = document.getElementById(`post-tags-div${post.id}`).innerHTML = ``
            post_tags_div.innerHTML = ``

            let tags = post.tags 
            for (tag of tags){
                post_tags_div.innerHTML += `
                <button style="background-color: gray; color: white; border: none; border-radius: 10px">${tag.name}</button>
                `
            }
        }
    }).catch((error) =>{
        let errorPosts = document.getElementById("error-get-post")
        errorPosts.innerHTML = `${error}, please refresh the page or try later!!`
        errorPosts.style.display = "block"

        setTimeout(()=>{
            errorPosts.style.display = "none"
        }, 7000)
    })
}

// edit post button clicked
function editPostClicked(postObject){
    
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    document.getElementById("edit-title").value = `${post.title}`
    document.getElementById("edit-body").value = `${post.body}`
    document.getElementById("edit-post-img").src = `${post.image}`
    document.getElementById("edit-post-id").innerHTML = `${post.id}`
    document.getElementById("name-edit-post").innerHTML = `${post.author.name}`
    
    
    
    
}



// edit post
function editPost(){
    id = document.getElementById("edit-post-id").innerHTML
    let token = JSON.parse(localStorage.getItem("token"));
    axios.put(`https://tarmeezacademy.com/api/v1/posts/${id}`,
        {title: document.getElementById("edit-title").value, body: document.getElementById("edit-body").value}, 
        {headers: {"Authorization": `Bearer ${token}`}})
    .then((response)=>{
        openComments(id)
        let editPostModal = document.getElementById("edit-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(editPostModal)
        modalInstance.hide()
    })
    .catch((error)=>{
        let alertError = document.getElementById("editPost-alert")
        if (error.response.status == 401){
            alertError.innerHTML = `you are not authorized to edit this post!!`
        } else{
            alertError.innerHTML = `Error (${error})`
        }
        
        alertError.style.display = "block"
        
        setTimeout(()=>{
            alertError.style.display = "none"
        }, 10000)
    })
    

}

function deletePost(){
    id = document.getElementById("edit-post-id").innerHTML
    if(confirm("Are you sure you want to delete this post?")){

        axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`,{
            headers: {"Authorization": `Bearer ${JSON.parse(localStorage.getItem("token"))}`}
        })
        .then((response)=>{
            let id = response.data.data.author.id
            console.log(id)
            let editPostModal = document.getElementById("edit-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(editPostModal)
            modalInstance.hide()
            getUserPosts(`${id}`)
        })
        .catch((error)=>{
            let alertError = document.getElementById("editPost-alert")
            alertError.innerHTML = `Error (${error})`
            
            alertError.style.display = "block"
            
            setTimeout(()=>{
                alertError.style.display = "none"
            }, 10000)
        })
    } else{
        return
    }

}

function openComments(id){
    window.location = "./../post details/index.html?id=" + String(id)
}

getSpecificUser(id)
getUserPosts(id)