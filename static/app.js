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
//click hint button
document.getElementById("hint-button").addEventListener("click", function() {
            const token = sessionStorage.getItem("token");
            console.log(token)
            fetch("/hunt/next-hint", {
                method: "GET",
                headers: {'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
            })
            .then(get_res)
            .then(data => {
            // data is what your API returned
            const the_hint_element = document.getElementById("the-hint");
            if (data.message) {
                the_hint_element.textContent = data.message
            }
            else {
                the_hint_element.textContent = data.hint
            }

                        console.log(data.message)

            }).catch(err => {
                alert(err.detail)
                }) 

})

document.getElementById("progress-button").addEventListener("click", function() {
            const token = sessionStorage.getItem("token");
            fetch("/hunt/progress", {
                method: "GET",
                headers: {'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
            })
            .then(get_res)
            .then(data => {
            // data is what your API returned
            const the_progress_element = document.getElementById("the-progress");
            the_progress_element.textContent = data.message
            console.log(data.message)

            }).catch(err => {
                alert(err.detail)
                }) 

})

document.getElementById("location-check").addEventListener("click", function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success,error);

            }
})

function get_token(token_response) {
    if (!token_response.ok) {
        return token_response.json().then(err => { throw err });
    }
        return token_response.json()
}
function get_res(response) {
    if (!response.ok) {
        return response.json().then(err => { throw err });
    }
        return response.json()
}


function success(pos) {
    const token = sessionStorage.getItem("token");
    let user_lat = pos.coords.latitude;       
    let user_lon = pos.coords.longitude;
    fetch("/hunt/check-location", {
        method: "POST",
        headers: {'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        body: JSON.stringify({"latitude": user_lat, "longitude": user_lon})
    }).then(get_token)
        .then(data => {
    // data is what your API returned
    let the_location_element = document.getElementById("the-location")
    console.log(data.message)
    the_location_element.textContent = data.message
        }).catch(err => {
            alert(err.detail)
            }) 

    console.log("Your current position is:");
    console.log(`Latitude : ${pos.coords.latitude}`);
    console.log(`Longitude: ${pos.coords.longitude}`);
    console.log(`More or less ${pos.coords.accuracy} meters.`);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
