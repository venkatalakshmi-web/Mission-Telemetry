const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        loginMessage.textContent = "Please enter username and password.";
        return;
    }

    loginMessage.textContent = "Login successful. Opening dashboard...";

    setTimeout(function () {
        window.location.href = "dashboard.html";
    }, 800);
});