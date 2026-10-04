const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
window.addEventListener("pageshow", function () {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
});
loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    if (username === "" || password === "") {

        loginMessage.textContent =
            "Please enter username and password.";

        return;
    }


    fetch("http://127.0.0.1:5000/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    .then(response => {

        return response.json().then(data => ({
            status: response.status,
            data: data
        }));

    })

    .then(result => {

        if (result.status === 200) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", result.data.user.full_name);
            loginMessage.textContent =
                "Login successful. Opening dashboard...";

            setTimeout(function () {

                window.location.href =
                    "dashboard.html";

            }, 800);

        }

        else if (result.status === 401) {

            loginMessage.textContent =
                "Invalid username or password.";

        }

        else {

            loginMessage.textContent =
                result.data.message ||
                "Login failed.";

        }

    })

    .catch(error => {

        console.error(
            "Login Error:",
            error
        );

        loginMessage.textContent =
            "Unable to connect to server.";

    });

});