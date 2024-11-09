
// set up UI function
function setupUI(){
    let token = localStorage.getItem("token")
    if (token == null){
        let signinBtn = document.getElementById("signin-btn-header")
        let loginBtn = document.getElementById("login-btn")
        let logoutBtn = document.getElementById("logout-btn-header")
        let addPost = document.getElementById("add-post-btn")

        if (addPost != null) {
            addPost.style.display = "none"
        }

        
        logoutBtn.style.display = "none"
        signinBtn.style.display = "inline"
        loginBtn.style.display = "inline"
    
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
        let logoutBtn = document.getElementById("logout-btn-header")
        let loginBtn = document.getElementById("login-btn")
        let signinBtn = document.getElementById("signin-btn-header")
        let addPost = document.getElementById("add-post-btn")

        if (addPost != null) {
            addPost.style.display = "block"
        }

        logoutBtn.style.display = "inline"
        loginBtn.style.display = "none"
        signinBtn.style.display = "none"

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
        if (addPost != null) {
            document.getElementById("usernam-input-post").value = `${userInfo.username}`
        }
        
    }
}

// sing in place ======================================================================================

// sign in
document.getElementById("signin-btn").addEventListener("click", ()=>{
    let email = document.getElementById("email-input-signin").value
    let usernam = document.getElementById("usernam-input-signin").value
    let password = document.getElementById("password-input-signin").value
    let name = document.getElementById("name-input-signin").value
    let image = document.getElementById("profile-img-input").files[0]

    signIn(email, usernam, password, name, image)
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


// log in place =======================================================================================

// log in
document.getElementById("login-button").addEventListener("click", ()=>{
    let username = document.getElementById("usernam-input-login").value
    let password = document.getElementById("password-input-login").value

    logIn(username, password)
})

// log in function
function logIn(username, password){
    axios.post("https://tarmeezacademy.com/api/v1/login",{
        
        "username": `${username}`, 
        "password":`${password}`,
        
    })
    .then((response)=>{
        console.log(response)
        let token = response.data.token

        let logInModal = document.getElementById("loginModal")

        localStorage.setItem("token", JSON.stringify(token))
        localStorage.setItem("user", JSON.stringify(response.data.user))

        setupUI()

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

// =======================================================================================================================================

function hideAlert(){
    let alert = document.getElementById("alert-sign-log")

    alert.style.display = "none"

}

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
        location.reload();
        setTimeout(()=>{
            alertSuccess.style.display = "none"
        }, 10000)

        // let profileA = document.getElementById("profile-a")
        // profileA.classList.add("disabled")
    })
})

function getCurrentUser(){
    let user = null
    const storageUser = localStorage.getItem("user")
    if (storageUser != null){
        user = JSON.parse(storageUser)
    }
    return user
}



setupUI()

