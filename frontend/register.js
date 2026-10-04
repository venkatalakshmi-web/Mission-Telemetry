const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const fullName =
        document.getElementById("fullName").value.trim();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check empty fields
    if (
        fullName === "" ||
        username === "" ||
        password === ""
    ) {
        registerMessage.textContent =
            "Please fill in all fields.";
        return;
    }


    // Check password match
    if (password !== confirmPassword) {

        registerMessage.textContent =
            "Passwords do not match.";

        return;
    }


    // Send registration data to Flask backend
    fetch("http://127.0.0.1:5000/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            full_name: fullName,
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

        if (result.status === 201) {

            registerMessage.textContent =
                "Account created successfully. Redirecting...";

            setTimeout(function () {

                window.location.href = "login.html";

            }, 1000);

        }

        else if (result.status === 409) {

            registerMessage.textContent =
                "Username already exists.";

        }

        else {

            registerMessage.textContent =
                result.data.message ||
                "Registration failed.";

        }

    })

    .catch(error => {

        console.error(
            "Registration Error:",
            error
        );

        registerMessage.textContent =
            "Unable to connect to server.";

    });

});