

function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if (storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
}

// get posts
function getPosts(reload = true, page = 1){
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=6&page=${page}`)
    .then((response)=>{
        let posts = response.data.data
        lastPage = response.data.meta.last_page

        let postsDiv = document.getElementById("posts")

        if (reload == true){
            postsDiv.innerHTML = ""
        }

        
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
                    <img src="${post.image}" alt="" style="width: 100%; max-height: 2000px; max-width: 2000px;">
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
            
            let editPostModal = document.getElementById("edit-post-modal")
            const modalInstance = bootstrap.Modal.getInstance(editPostModal)
            modalInstance.hide()
            getPosts()
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

// open comments
function openComments(id){
    window.location = "./../post details/index.html?id=" + String(id)
}

function openProfile(id){
    window.location = "./../profile page/index.html?id=" + String(id)
}

// create a new post
function createPost(){
    let title = document.getElementById("recipient-name").value
    let message = document.getElementById("message-text").value
    let token = JSON.parse(localStorage.getItem("token"))

    let post_alert = document.getElementById("post-alert")

    let image = document.getElementById("upload-image").files[0]
    let imageSize = (image.size / 1024).toFixed(2)

    if (title == "" || message == "" || image == ""){
        post_alert.innerHTML = `Please enter title and message and upload an image!!`
        post_alert.style.display = "block"
        setTimeout(()=>{
            post_alert.style.display = "none"
        }, 10000)
        return 
    }

    if (imageSize >= 800){
        post_alert.innerHTML = `Please upload image less than 800kb!!`
        post_alert.style.display = "block"
        setTimeout(()=>{
            post_alert.style.display = "none"
        }, 10000)
        return 
    }

    let formData = new FormData()
    formData.append("title", title)
    formData.append("body", message)
    formData.append("image", image)
    

    axios.post("https://tarmeezacademy.com/api/v1/posts",formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
    .then((response)=>{
        console.log(response)
        
        let postModal = document.getElementById("add-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(postModal)
        modalInstance.hide()
        getPosts()
    })
    .catch((error)=>{
        post_alert.innerHTML = `Error (${error})`
        post_alert.style.display = "block"
        setTimeout(()=>{
            post_alert.style.display = "none"
        }, 10000)
        return 
    })
}

// click post
document.getElementById("post-btn").addEventListener("click",()=>{
    createPost()
})


// sign in
document.getElementById("signin-btn").addEventListener("click", ()=>{
    let email = document.getElementById("email-input-signin").value
    let usernam = document.getElementById("usernam-input-signin").value
    let password = document.getElementById("password-input-signin").value
    let name = document.getElementById("name-input-signin").value
    let image = document.getElementById("profile-img-input").files[0]

    signIn(email, usernam, password, name, image)
})


// log in
document.getElementById("login-button").addEventListener("click", ()=>{
    let username = document.getElementById("usernam-input-login").value
    let password = document.getElementById("password-input-login").value

    logIn(username, password)
})

// log out
let logoutBtn = document.getElementById("logout-btn-header")
logoutBtn.addEventListener("click", ()=>{

    document.getElementById("confirmation-logout").addEventListener("click", ()=>{

        let logout_modal = document.getElementById("logout-modal")

    
        localStorage.clear()

        setupUI()

        const modalInstance2 = bootstrap.Modal.getInstance(logout_modal)
        modalInstance2.hide()


        let alertSuccess = document.getElementById("alert-sign-log")
        alertSuccess.classList.remove("alert-success")
        alertSuccess.classList.add("alert-danger")
        alertSuccess.innerHTML = `<button type="button" id="close-alert" class="btn-close" aria-label="Close" onclick="hideAlert()"></button>  You have successfully logged out!!`
        alertSuccess.style.display = "block"
        setTimeout(()=>{
            alertSuccess.style.display = "none"
        }, 10000)

        // let profileA = document.getElementById("profile-a")
        // profileA.classList.add("disabled")
    })
})


// sign in function
function signIn(email, username, password, name, image){
    // make sure inputs are not empty
    if(email == "" || username == "" || password == "" || name == "" || image == ""){
        let alertSignIn = document.getElementById("signin-alert")
        alertSignIn.innerHTML = `The inforamtion are not complited!!`
        alertSignIn.style.display = "block"
        setTimeout(()=>{
            alertSignIn.style.display = "none"
        }, 10000)
        return
    }

    // make sure the profile image size is not greater than 800kb
    let imageSize = (image.size / 1024).toFixed(2)
    if (imageSize >= 800){
        let alertSignIn = document.getElementById("signin-alert")
        alertSignIn.innerHTML = `The profile image size is greater than 800kb, please upload image less than 800kb`
        alertSignIn.style.display = "block"
        setTimeout(()=>{
            alertSignIn.style.display = "none"
        }, 15000)
        return
    }

    // form data 
    let formData = new FormData()
    formData.append("email", email)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("name", name)
    formData.append("image", image)
    console.log(image)
    fetch("https://tarmeezacademy.com/api/v1/register",{
        method: "POST",
        body: formData
    })
    .then((response)=> response.json())
    .then((data)=>{
        console.log(data)
        let token = data.token

        let signInModal = document.getElementById("signInModule")
        
        localStorage.setItem("token", JSON.stringify(token))
        localStorage.setItem("user", JSON.stringify(data.user))
        
        setupUI()
        
        const modalInstance = bootstrap.Modal.getInstance(signInModal)
        modalInstance.hide()

        let alertSuccess = document.getElementById("alert-sign-log")
        alertSuccess.classList.add("alert-success")
        alertSuccess.classList.remove("alert-danger")
        alertSuccess.innerHTML = `<button type="button" id="close-alert" class="btn-close" aria-label="Close" onclick="hideAlert()"></button>  Registration completed successfully!!`
        alertSuccess.style.display = "block"
        setTimeout(()=>{
            alertSuccess.style.display = "none"
        }, 10000)

    }).catch(function(error) {
        
        console.log('Error occurred:', error);
        let alertSignIn = document.getElementById("signin-alert");
        if (error.response) {

            if (error.response.status == 422) {
                alertSignIn.innerHTML = `Username is already taken. Please choose another one.`;
            } else {
                alertSignIn.innerHTML = `An error occurred. Please choose another one.`;
            }

        } else {
            alertSignIn.innerHTML = `An unknown error occurred.`;
        }

        alertSignIn.style.display = "block"
        setTimeout(()=>{
            alertSignIn.style.display = "none"
        }, 15000)
    })
}

// log in function
function logIn(username, password){
    axios.post("https://tarmeezacademy.com/api/v1/login",{
        
        "username": `${username}`, 
        "password":`${password}`,
        
    })
    .then((response)=>{
        console.log(response)
        let token = response.data.token

        
        localStorage.setItem("token", JSON.stringify(token))
        localStorage.setItem("user", JSON.stringify(response.data.user))
        
        setupUI()
        
        let logInModal = document.getElementById("loginModal")
        const modalInstance = bootstrap.Modal.getInstance(logInModal)
        modalInstance.hide()

        let alertSuccess = document.getElementById("alert-sign-log")
        alertSuccess.classList.add("alert-success")
        alertSuccess.classList.remove("alert-danger")
        // todo : add close button of the alert
        alertSuccess.innerHTML = `<button type="button" id="close-alert" class="btn-close" aria-label="Close" onclick="hideAlert()"></button> You have been logged in successfully!!`
        alertSuccess.style.display = "block"
        setTimeout(()=>{
            alertSuccess.style.display = "none"
        }, 10000)

    }).catch((error)=>{
        let alertSignIn = document.getElementById("login-alert")
        alertSignIn.innerHTML = `${error.response.data.message}`
        alertSignIn.style.display = "block"
        setTimeout(()=>{
            alertSignIn.style.display = "none"
        }, 10000)
    })
}

// set up UI function
function setupUI(){
    let token = localStorage.getItem("token")
    let signinBtn = document.getElementById("signin-btn-header")
    let loginBtn = document.getElementById("login-btn")
    let logoutBtn = document.getElementById("logout-btn-header")
    let addPost = document.getElementById("add-post-btn")
    let postEditBtn = document.getElementsByClassName("edit-post-button");
    if (token == null){

        addPost.style.display = "none"
        logoutBtn.style.display = "none"
        signinBtn.style.display = "inline"
        loginBtn.style.display = "inline"
        
        for(let i = 0; i < postEditBtn.length; i++){
            postEditBtn[i].style.display = "none"
        }
    
        localStorage.clear()


        
        let profileA = document.getElementById("profile-a")
        profileA.classList.add("disabled")

        // rmove the username and his image profile
        let userDiv = document.getElementById("user-div")
        
        userDiv.style.display = "none"

        // add profile image and username
        userDiv.innerHTML = `
            <a style="cursor: pointer;">
                <img src="https://images.tarmeezacademy.com/users/7qBV10OKTipdMye.jpg" id="profile-img" alt="profile image" style="width: 40px; height: 40px; border-radius: 50px; border: 1px #198754 solid;">
                <b style="font-size: 20px; color: rgb(178, 178, 178);">@</b><span style="font-size: 20px;" id="username-nav">Username</span>
            </a>
        `
    } else{

        addPost.style.display = "block"
        logoutBtn.style.display = "inline"
        loginBtn.style.display = "none"
        signinBtn.style.display = "none"

        for(let i = 0; i < postEditBtn.length; i++){
            postEditBtn[i].style.display = "inline-block"
        }
        
        

        let profileA = document.getElementById("profile-a")
        profileA.classList.remove("disabled")

        // add the username and his image profile
        let userDiv = document.getElementById("user-div")
        let userInfo = JSON.parse(localStorage.getItem("user"))
        console.log(userInfo)

        userDiv.style.display = "block"

        // add profile image and username
        console.log(userInfo.profile_image)
        
        if (String(userInfo.profile_image) == '[object Object]'){
            userInfo.profile_image = "https://images.tarmeezacademy.com/users/7qBV10OKTipdMye.jpg"
        } 

        userDiv.innerHTML = `
            <a style="cursor: pointer;">
                <img src="${userInfo.profile_image}" id="profile-img" alt="profile image" style="width: 40px; height: 40px; border-radius: 50px; border: 1px #198754 solid;">
                <b style="font-size: 20px; color: rgb(178, 178, 178);">@</b><span style="font-size: 20px;" id="username-nav">${userInfo.username}</span>
            </a>
        `
        document.getElementById("usernam-input-post").value = `${userInfo.username}`
        
    }
}

//function hide the alert 

function hideAlert(){
    let alert = document.getElementById("alert-sign-log")

    alert.style.display = "none"

}

// refresh post function (infinity scrolling)
function refreshPosts(page){
    axios.get(`https://tarmeezacademy.com/api/v1/posts?page=${page}`)
    .then((response)=>{
        let posts = response.data.data
        let postsDiv = document.getElementById("posts")
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
        
            postsDiv.innerHTML += `
            <div class="card mb-3">
                <div class="card-header" style="border-bottom: 0.1px white solid;">
                    <img class="rounded-circle border border-2" src="${post.author.profile_image}" alt="" style="width: 30px; height: 30px;">
                    <b>@${post.author.username}</b>
                </div>
                
                <div class="img mt-1">
                    <img src="${post.image}" alt="" style="width: 100%; max-height: 2000px; max-width: 2000px;">
                </div>
                <div class="card-time">
                    <h6 class="mx-3 mt-2 pt-0" style="color: rgb(155, 155, 155);">${post.created_at}</h6>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-text">${post.body}</p>
                    <hr>
                </div>
                <div class="container mb-3" style="display: flex; justify-content: space-between;">
                    <div style="margin-left: 5px; margin-right: 5px;">
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
    })
    .catch((error) =>{
        let errorPosts = document.getElementById("error-get-post")
        errorPosts.innerHTML = `${error}, please refresh the page or try later!!`
        errorPosts.style.display = "block"

        setTimeout(()=>{
            errorPosts.style.display = "none"
        }, 7000)
    })
}


document.getElementById("profile-a").addEventListener("click", ()=>{
    let value = localStorage.getItem("user")
    let data = JSON.parse(value)
    openProfile(data.id)
})

let page = 1
let lastPage = 1
getPosts(true, 1)

window.addEventListener("scroll", ()=>{
    
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage && page < lastPage){
        page = page + 1
        console.log(page)
        getPosts(false, page)
    }
})

setupUI()
