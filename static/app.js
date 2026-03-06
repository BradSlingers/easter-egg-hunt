var map;
check_logged_in()
document.getElementById("goto-signup").addEventListener("click", function() {
    // hide welcome, show signup
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("signup-screen").style.display = "block"
    document.getElementById("signup-email").value = ""
    document.getElementById("verify-email").value = ""
    document.getElementById("signup-password").value = ""
    document.getElementById("signup-verify").value = ""

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
            .then(function(data) {
            // data is what your API returned
            localStorage.setItem("token", data);
            document.getElementById("signup-screen").style.display = "none";
            document.getElementById("hunt-screen").style.display = "block";
            load_map()
            reset_hunt_screen()
            get_hint()
            get_progress()

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
            localStorage.setItem("token", data);
            // hide login, show hunt
            document.getElementById("login-screen").style.display = "none";
            document.getElementById("hunt-screen").style.display = "block";
            load_map()
            reset_hunt_screen()
            get_hint()
            get_progress()

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
    get_hint()

})

document.getElementById("progress-button").addEventListener("click", function() {
    get_progress()
})

document.getElementById("location-check").addEventListener("click", function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success,error,{timeout:10000});
            }
            else {
                document.getElementById("the-location").textContent = "Your browser doesn't support GPS."

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
    const token = localStorage.getItem("token");
    // let user_lat = pos.coords.latitude;       
    // let user_lon = pos.coords.longitude;
    let user_lat = -34.069860126069145  
    let user_lon = 18.568539443003324
    
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
    if (data.found === true) {
        if (data.golden === 1) {
            the_location_element.textContent = data.message + " "+ data.egg_lat
            document.getElementById("hunt-screen").style.display = "none"
            document.getElementById("win-screen").style.display = "block"

        }
        else {
            the_location_element.textContent = data.message + " "+ data.egg_lat
            L.marker([data.egg_lat, data.egg_lon]).addTo(map)
            get_hint()
            get_progress()

        }
    }
    else {
        the_location_element.textContent = data.message + " "+ data.egg_lat
    }
        }).catch(err => {
            alert(err.detail)
            }) 

    console.log("Your current position is:");
    console.log(`Latitude : ${pos.coords.latitude}`);
    console.log(`Longitude: ${pos.coords.longitude}`);
    console.log(`More or less ${pos.coords.accuracy} meters.`);
}

function error(err) {
    document.getElementById("the-location").textContent = "GPS Error: " + err.code + " - " + err.message
}

function get_hint() {

    const token = localStorage.getItem("token");
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
}

function get_progress() {

    const token = localStorage.getItem("token");
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

}

function reset_hunt_screen() {
    document.getElementById("the-progress").textContent = "";
    document.getElementById("the-hint").textContent = "";
    document.getElementById("the-location").textContent = "";
}

function load_map() {
    let latitude = -34.07696887052403
    let longitude = 18.558290567569447
    zoomlevel = 13
    map = L.map('map',{attributionControl:false}).setView([latitude, longitude], zoomlevel)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png') 
        .addTo(map);
}

function check_logged_in() {
    let token = localStorage.getItem("token")
    if (token) {
        fetch("/auth/me", {
            method: "GET",
            headers: {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
        })
        .then(get_res)
        .then(data => {
        // data is what your API returned
        if (data.email) {
            document.getElementById("welcome-screen").style.display = "none";
            document.getElementById("hunt-screen").style.display = "block";
            load_map()
            reset_hunt_screen()
            get_hint()
            get_progress()
        }
        else {
            document.getElementById("welcome-screen").style.display = "block";
        }

            console.log(data.email)

        }).catch(err => {
            alert(err.detail)
            }) 

        }
    else {
        document.getElementById("welcome-screen").style.display = "block";

    }

}