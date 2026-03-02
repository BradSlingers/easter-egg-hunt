document.getElementById("goto-signup").addEventListener("click", function() {
    // hide welcome, show signup
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("signup-screen").style.display = "block"

})

document.getElementById("submit-signup").addEventListener("click", function() {
    let sign_up_email = document.getElementById("signup-email").value
    let verify_email = document.getElementById("verify-email").value
    let sign_up_password = document.getElementById("signup-password").value
    let sign_verify = document.getElementById("signup-verify").value

    if (sign_up_email == verify_email) {
        if (sign_up_password == sign_verify) {
            fetch("/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            })
            .then(response => response.json())
            .then(data => {
            // data is what your API returned

            }) 

        }
        else {

        }
    }
    else {
        document.getElementById("error-email").style.display = "block"
    }


    //     // hide signup, show hunt-screen
    // document.getElementById("signup-screen").style.display = "none"
    // document.getElementById("hunt-screen").style.display = "block"
})


document.getElementById("goto-login").addEventListener("click", function() {
    // hide welcome, show login
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("login-screen").style.display = "block"

})

document.getElementById("submit-login").addEventListener("click", function() {
    // hide login, show hunt
    document.getElementById("login-screen").style.display = "none"
    document.getElementById("hunt-screen").style.display = "block"
})


document.getElementById("login-back").addEventListener("click", function() {
    // hide login, show welcome
    document.getElementById("login-screen").style.display = "none"
    document.getElementById("welcome-screen").style.display = "block"
})


document.getElementById("signup-back").addEventListener("click", function() {
    // hide signup, show welcome
    document.getElementById("signup-screen").style.display = "none"
    document.getElementById("error-email").style.display = "none"
    document.getElementById("error-password").style.display = "none"
    document.getElementById("welcome-screen").style.display = "block"
})

document.getElementById("hunt-back").addEventListener("click", function() {
    // hide hunt, show welcome
    document.getElementById("hunt-screen").style.display = "none"
    document.getElementById("welcome-screen").style.display = "block"
})

document.getElementById("error-back").addEventListener("click", function() {
    // hide hunt, show welcome
    document.getElementById("error-email").style.display = "none"
    document.getElementById("error-password").style.display = "none"
    document.getElementById("signup-screen").style.display = "block"
})