
// get posts
function getPosts(){
    axios.get("https://tarmeezacademy.com/api/v1/posts")
    .then((response)=>{
        let posts = response.data.data
        
        console.log(posts)
        let postsDiv = document.getElementById("posts")
        postsDiv.innerHTML = ""
        for (post of posts){
            let tags = post.tags
            if (String(post.title) == "null"){
                post.title = ""
            }
            if (String(post.body) == "null"){
                post.body = ""
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
                    <h6 class="mx-3 mt-2 pt-0" style="color: rgb(155, 155, 155);">${post.created_at}</h5>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-text">${post.body}</p>
                    <hr>
                </div>
                <div class="container mb-3" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16" style="cursor: pointer; margin-right:10px">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                    </svg>
                    <h5 style="font-weight: 100; display: inline;">(${post.comments_count}) Comments</h5>
                    <div id="tags-div" style="display:inline; width:100%"></div>
                </div>
            </div>
            `
            
        }
    }).catch((error) =>{
        let errorPosts = document.getElementById("error-get-post")
        errorPosts.innerHTML = `${error}, please refresh the page`
        errorPosts.style.display = "block"

        setTimeout(()=>{
            errorPosts.style.display = "none"
        }, 7000)
    })
}

// sign in
document.getElementById("signin-btn").addEventListener("click", ()=>{
    let email = document.getElementById("email-input-signin").value
    let usernam = document.getElementById("usernam-input-signin").value
    let password = document.getElementById("password-input-signin").value
    let name = document.getElementById("name-input-signin").value

    signIn(email, usernam, password, name)
})


// log in
document.getElementById("login-button").addEventListener("click", ()=>{
    let username = document.getElementById("usernam-input-login").value
    let password = document.getElementById("password-input-login").value

    logIn(username, password)
})


// sign in function
function signIn(email, username, password, name){
    axios.post("https://tarmeezacademy.com/api/v1/register",{
        "email":`${email}`,
        "username": `${username}`, 
        "password":`${password}`,
        "name":`${name}`
    })
    .then((response)=>{
        console.log(response)
        let token = response.data.token
        localStorage.setItem("authToken", token)
    }).catch((error)=>{
        let alertSignIn = document.getElementById("signin-alert")
        alertSignIn.innerHTML = `${error.response.data.message}`
        alertSignIn.style.display = "block"
        setTimeout(()=>{
            alertSignIn.style.display = "none"
        }, 10000)
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

        let logoutBtn = document.getElementById("logout-btn-header")
        let loginBtn = document.getElementById("login-btn")
        let signinBtn = document.getElementById("signin-btn-header")

        logoutBtn.style.display = "inline"
        loginBtn.style.display = "none"
        signinBtn.style.display = "none"
    }).catch((error)=>{
        let alertSignIn = document.getElementById("login-alert")
        alertSignIn.innerHTML = `${error.response.data.message}`
        alertSignIn.style.display = "block"
        setTimeout(()=>{
            alertSignIn.style.display = "none"
        }, 10000)
    })
}


getPosts()
