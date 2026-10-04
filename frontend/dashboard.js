if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}
const closeButton = document.querySelector(".close-sidebar");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".dashboard-header");
const container = document.querySelector(".dashboard-container");


/* -------------------------------
   SIDEBAR
-------------------------------- */

closeButton.addEventListener("click", function () {

    sidebar.style.display = "none";
    menuButton.style.display = "block";

    header.style.marginLeft = "0";
    container.style.marginLeft = "auto";
});


menuButton.addEventListener("click", function () {

    sidebar.style.display = "block";
    menuButton.style.display = "none";

    header.style.marginLeft = "220px";
    container.style.marginLeft = "250px";
});


/* -------------------------------
   UPDATE DASHBOARD
-------------------------------- */

function updateTelemetry() {

    fetch("http://127.0.0.1:5000/telemetry")

        .then(response => response.json())

        .then(data => {

            if (data.length === 0) {
                return;
            }

            const latest = data[0];


            /* -------------------------------
               MAIN TELEMETRY VALUES
            -------------------------------- */

            const temperature =
                Number(latest.temperature);

            const battery =
                Number(latest.battery);

            const pressure =
                Number(latest.pressure);

            const signal =
                Number(latest.signal_strength);


            /* -------------------------------
               ADDITIONAL TELEMETRY VALUES
            -------------------------------- */

            const altitude =
                Number(latest.altitude);

            const velocity =
                Number(latest.velocity);

            const power =
                Number(latest.power);

            const orientation =
                Number(latest.orientation);


            /* -------------------------------
               DISPLAY MAIN VALUES
            -------------------------------- */

            document.getElementById("temperature").textContent =
                temperature + " °C";

            document.getElementById("battery").textContent =
                battery + " %";

            document.getElementById("pressure").textContent =
                pressure + " kPa";

            document.getElementById("signal").textContent =
                signal + " %";


            /* -------------------------------
               DISPLAY ADDITIONAL VALUES
            -------------------------------- */

            document.getElementById("altitude").textContent =
                altitude + " km";

            document.getElementById("velocity").textContent =
                velocity + " km/s";

            document.getElementById("power").textContent =
                power + " W";

            document.getElementById("orientation").textContent =
                orientation + " °";


            /* -------------------------------
               PROGRESS BARS
            -------------------------------- */

            document.querySelector(
                ".temperature-progress"
            ).style.width =
                ((temperature - 20) / 20 * 100) + "%";


            document.querySelector(
                ".battery-progress"
            ).style.width =
                battery + "%";


            document.querySelector(
                ".pressure-progress"
            ).style.width =
                ((pressure - 95) / 10 * 100) + "%";


            document.querySelector(
                ".signal-progress"
            ).style.width =
                signal + "%";


            /* -------------------------------
               ALERT STATUS
            -------------------------------- */

            const alertMessage =
                document.getElementById("alertMessage");


            if (temperature > 30) {

                alertMessage.textContent =
                    "⚠️ High Temperature Detected";

            }

            else if (battery < 30) {

                alertMessage.textContent =
                    "⚠️ Battery Level Low";

            }

            else if (signal < 90) {

                alertMessage.textContent =
                    "⚠️ Weak Signal Detected";

            }

            else {

                alertMessage.textContent =
                    "✓ No active alerts.";

            }

        })

        .catch(error => {

            console.error(
                "Dashboard Telemetry API Error:",
                error
            );

        });
}


/* -------------------------------
   FIRST UPDATE
-------------------------------- */

updateTelemetry();


/* -------------------------------
   UPDATE EVERY 3 SECONDS
-------------------------------- */

setInterval(
    updateTelemetry,
    3000
);
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("isLoggedIn");

        window.location.href = "login.html";
    });
}