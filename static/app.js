document.getElementById("goto-signup").addEventListener("click", function() {
    // hide welcome, show signup
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("signup-screen").style.display = "block"
})
document.getElementById("goto-login").addEventListener("click", function() {
    // hide welcome, show signup
    document.getElementById("welcome-screen").style.display = "none"
    document.getElementById("login-screen").style.display = "block"
})
document.getElementById("login-back").addEventListener("click", function() {
    // hide welcome, show signup
    document.getElementById("login-screen").style.display = "none"
    document.getElementById("welcome-screen").style.display = "block"
})
document.getElementById("signup-back").addEventListener("click", function() {
    // hide welcome, show signup
    document.getElementById("signup-screen").style.display = "none"
    document.getElementById("welcome-screen").style.display = "block"
})