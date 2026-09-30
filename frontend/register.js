const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (fullName === "" || username === "" || password === "") {
        registerMessage.textContent =
            "Please fill in all fields.";
        return;
    }

    if (password !== confirmPassword) {
        registerMessage.textContent =
            "Passwords do not match.";
        return;
    }

    registerMessage.textContent =
        "Account created successfully. Redirecting...";

    setTimeout(function () {
        window.location.href = "login.html";
    }, 1000);
});