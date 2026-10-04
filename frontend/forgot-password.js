const forgotForm =
    document.getElementById("forgotForm");

const forgotMessage =
    document.getElementById("forgotMessage");


forgotForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const username =
            document.getElementById("username").value.trim();

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check empty fields

        if (
            username === "" ||
            newPassword === "" ||
            confirmPassword === ""
        ) {

            forgotMessage.textContent =
                "Please fill in all fields.";

            return;
        }


        // Check passwords

        if (newPassword !== confirmPassword) {

            forgotMessage.textContent =
                "Passwords do not match.";

            return;
        }


        // Send data to backend

        fetch("http://127.0.0.1:5000/reset-password", {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                username: username,

                new_password: newPassword

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

                forgotMessage.textContent =
                    "Password reset successful. Redirecting...";


                setTimeout(function () {

                    window.location.href =
                        "login.html";

                }, 1000);

            }


            else if (result.status === 404) {

                forgotMessage.textContent =
                    "Username not found.";

            }


            else {

                forgotMessage.textContent =
                    result.data.message ||
                    "Password reset failed.";

            }

        })


        .catch(error => {

            console.error(
                "Password Reset Error:",
                error
            );

            forgotMessage.textContent =
                "Unable to connect to server.";

        });

    }
);