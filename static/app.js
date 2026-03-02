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
            let email = sign_up_email;
            let password = sign_up_password;
            fetch("/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            })
            .then(get_token)
            .then(data => {
            // data is what your API returned
            sessionStorage.setItem("token", data);
            document.getElementById("signup-screen").style.display = "none";
            document.getElementById("hunt-screen").style.display = "block";

            }).catch(err => {
                alert(err.detail)
                }) 

        }
        else {
                document.getElementById("error-password").style.display  = "block"
        }
    }
    else {
        document.getElementById("error-email").style.display = "block"
    }
})


document.getElementById("goto-login").addEventListener("click", function() {
    // hide welcome, show login
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("login-screen").style.display = "block"

})

document.getElementById("submit-login").addEventListener("click", function() {
            let email = document.getElementById("login-email").value;
            let password = document.getElementById("login-password").value;
            fetch("/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email: email, password: password})
            })
            .then(get_token)
            .then(data => {
            // data is what your API returned
            sessionStorage.setItem("token", data);
            // hide login, show hunt
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("hunt-screen").style.display = "block";

            }).catch(err => {
                alert(err.detail)
                }) 

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

document.getElementById("error-email-back").addEventListener("click", function() {
    // hide hunt, show welcome
    document.getElementById("error-email").style.display = "none"
    document.getElementById("error-password").style.display = "none"
    document.getElementById("signup-screen").style.display = "block"
})
document.getElementById("error-password-back").addEventListener("click", function() {
    // hide hunt, show welcome
    document.getElementById("error-email").style.display = "none"
    document.getElementById("error-password").style.display = "none"
    document.getElementById("signup-screen").style.display = "block"
})
function get_token(token_response) {
    if (!token_response.ok) {
        return token_response.json().then(err => { throw err });
    }
        return token_response.json()
}