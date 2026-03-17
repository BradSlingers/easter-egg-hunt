var map;
check_logged_in()
document.getElementById("goto-join").addEventListener("click", function() {
    // hide welcome, show signup
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("join-screen").style.display = "flex"
    document.getElementById("join-name").value = ""
    document.getElementById("join-number").value = ""

})

document.getElementById("submit-join").addEventListener("click", function() {
    let joinName = document.getElementById("join-name").value
    let joinNumber = document.getElementById("join-number").value

    if (/^0\d{9}$/.test(joinNumber)) {

        document.getElementById("number-check").style.display = "flex"
        const the_check_number = document.getElementById("the-phonenumber");
        the_check_number.textContent = joinNumber 

    }
    else {
            document.getElementById("error-number").style.display  = "block"
    }
})

document.getElementById("correct-number").addEventListener("click", function() {
    let joinName = document.getElementById("join-name").value
    let joinNumber = document.getElementById("join-number").value
    fetch("/auth/join", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: joinName, number: joinNumber})
    })
    .then(get_token)
    .then(function(data) {
    // data is what your API returned
    localStorage.setItem("token", data);
    document.getElementById("number-check").style.display = "none";
    document.getElementById("join-screen").style.display = "none";
    // document.getElementById("hunt-screen").style.display = "block";
    document.getElementById("instruction-screen").style.display = "block";
    // Remove map and clean up
    // moved the below code to own function because I show instruction screen first
    //put it in skip click even
    // if (map != undefined) {
    //     map.off();
    //     map.remove();
    // }

    // load_map()
    // reset_hunt_screen()
    // get_hint()
    // get_progress()

    }).catch(err => {
        alert(err.detail)
        }) 

})

document.getElementById("incorrect-number").addEventListener("click", function() {
    document.getElementById("number-check").style.display = "none"
    document.getElementById("join-screen").style.display = "flex"

})

// document.getElementById("goto-login").addEventListener("click", function() {
//     // hide welcome, show login
//     document.getElementById("welcome-screen").style.display = "none"
//     document.getElementById("login-screen").style.display = "flex"
//     document.getElementById("login-email").value = ""
//     document.getElementById("login-password").value = ""

// })

// document.getElementById("submit-login").addEventListener("click", function() {
//             let email = document.getElementById("login-email").value;
//             let password = document.getElementById("login-password").value;
//             fetch("/auth/login", {
//                 method: "POST",
//                 headers: {"Content-Type": "application/json"},
//                 body: JSON.stringify({email: email, password: password})
//             })
//             .then(get_token)
//             .then(data => {
//             // data is what your API returned
//             localStorage.setItem("token", data);
//             // hide login, show hunt
//             document.getElementById("login-screen").style.display = "none";
//             // document.getElementById("hunt-screen").style.display = "block";
//             document.getElementById("instruction-screen").style.display = "block";
//             // moved the below code to own function because I show instruction screen first
//             //put it in skip screen click
//             // if (map != undefined) {
//             //     map.off();
//             //     map.remove();
//             // }
//             // load_map()
//             // reset_hunt_screen()
//             // get_hint()
//             // get_progress()

//             }).catch(err => {
//                 alert(err.detail)
//                 }) 

// })


// document.getelementbyid("login-back").addeventlistener("click", function() {
//     // hide login, show welcome
//     document.getelementbyid("login-screen").style.display = "none"
//     document.getelementbyid("welcome-screen").style.display = "flex"
// })

document.getElementById("skip-instruction").addEventListener("click", function() {
    // hide login, show welcome
    document.getElementById("instruction-screen").style.display = "none"
    document.getElementById("hunt-screen").style.display = "block"
    remove_map_cleanup()

})


// document.getElementById("signup-back").addEventListener("click", function() {
//     // hide signup, show welcome
//     document.getElementById("join-screen").style.display = "none"
//     document.getElementById("error-email").style.display = "none"
//     document.getElementById("error-password").style.display = "none"
//     document.getElementById("welcome-screen").style.display = "flex"
// })

document.getElementById("hunt-back").addEventListener("click", function() {
    // hide hunt, show welcome
    localStorage.removeItem("token")
    document.getElementById("hunt-screen").style.display = "none"
    document.getElementById("welcome-screen").style.display = "flex"
})

document.getElementById("error-email-back").addEventListener("click", function() {
    // hide hunt, show welcome
    document.getElementById("error-email").style.display = "none"
    document.getElementById("error-password").style.display = "none"
    document.getElementById("join-screen").style.display = "flex"
})
document.getElementById("error-password-back").addEventListener("click", function() {
    // hide hunt, show welcome
    document.getElementById("error-email").style.display = "none"
    document.getElementById("error-password").style.display = "none"
    document.getElementById("join-screen").style.display = "flex"
})
//click hint button
// document.getElementById("hint-button").addEventListener("click", function() {
//     get_hint()

// })

// document.getElementById("progress-button").addEventListener("click", function() {
//     get_progress()
// })

document.getElementById("location-check").addEventListener("click", function() {
    document.getElementById("location-check").disabled = true;
    document.getElementById("location-check").textContent = "Checking...";
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
    if (data.found === true) {
        if (data.golden === 1) {
            the_location_element.textContent = data.message
            document.getElementById("hunt-screen").style.display = "none"
            load_win_screen()

        }
        else {
            the_location_element.textContent = data.message
            L.marker([data.egg_lat, data.egg_lon]).addTo(map)
            get_hint()
            get_progress()

        }
    }
    else {
        the_location_element.textContent = data.message + " "+ data.haversine
    }
        }).catch(err => {
            alert(err.detail)
            }) 

    console.log("Your current position is:");
    console.log(`Latitude : ${pos.coords.latitude}`);
    console.log(`Longitude: ${pos.coords.longitude}`);
    document.getElementById("location-check").disabled = false;
    document.getElementById("location-check").textContent = "I'm Here!";
}

function error(err) {
    document.getElementById("the-location").textContent = "GPS: " + err.message + " Try Again"
    console.log(err.code)
    document.getElementById("location-check").disabled = false;
    document.getElementById("location-check").textContent = "I'm Here!";
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
    //gets a list of dictionarys of the egg coords already found
    //this is to update the map with markers when a person signs in and out
    if (data.egg_coords) {
        for (const coord of data.egg_coords) {
            L.marker([coord["lat"], coord["lon"]]).addTo(map)

        }

    }

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
        if (data.phonenum) {
            document.getElementById("welcome-screen").style.display = "none";
            document.getElementById("hunt-screen").style.display = "block";
            if (map != undefined) {
                map.off();
                map.remove();
            }
            load_map()
            reset_hunt_screen()
            get_hint()
            get_progress()
        }
        else {
            document.getElementById("welcome-screen").style.display = "flex";
            //testing
            // document.getElementById("instruction-screen").style.display = "flex";
        }

            console.log(data.phonenum)

        }).catch(err => {
            alert(err.detail)
            }) 

        }
    else {
        document.getElementById("welcome-screen").style.display = "flex";
        //testing
        // document.getElementById("instruction-screen").style.display = "flex";

    }

}
function load_win_screen() {
    document.getElementById("win-screen").style.display = "flex"

}

function remove_map_cleanup() {
    if (map != undefined) {
        map.off();
        map.remove();
    }
    load_map()
    reset_hunt_screen()
    get_hint()
    get_progress()

}

