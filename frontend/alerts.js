const closeButton = document.querySelector(".close-sidebar");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".dashboard-header");
const container = document.querySelector(".alerts-container");

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


let totalAlerts = 0;
let savedAlerts = new Set();


function checkAlerts() {

    fetch("http://127.0.0.1:5000/telemetry")

        .then(response => response.json())

        .then(data => {

            if (data.length === 0) return;

            const latest = data[0];

            const temperature = Number(latest.temperature);
            const battery = Number(latest.battery);
            const signal = Number(latest.signal_strength);

            const alerts = [];


            /* HIGH TEMPERATURE */

            if (temperature > 30) {

                alerts.push({
                    title: "⚠️ High Temperature",
                    message: "Temperature is above the normal threshold.",
                    type: "warning"
                });

            }


            /* LOW BATTERY */

            if (battery < 30) {

                alerts.push({
                    title: "⚠️ Low Battery",
                    message: "Battery level is below the recommended level.",
                    type: "warning"
                });

            }


            /* WEAK SIGNAL */

            if (signal < 90) {

                alerts.push({
                    title: "⚠️ Weak Signal",
                    message: "Communication signal strength is low.",
                    type: "warning"
                });

            }


            const alertList =
                document.getElementById("alertList");

            const activeAlerts =
                document.getElementById("activeAlerts");

            const totalAlertsElement =
                document.getElementById("totalAlerts");

            const systemStatus =
                document.getElementById("systemStatus");


            alertList.innerHTML = "";


            /* NO ALERTS */

            if (alerts.length === 0) {

                alertList.innerHTML = `
                    <div class="alert-item normal-alert">
                        <div>
                            <strong>✓ System Normal</strong>
                            <p>No critical telemetry alerts detected.</p>
                        </div>
                        <span>Monitoring</span>
                    </div>
                `;

                activeAlerts.textContent = "0";

                totalAlertsElement.textContent = "0";

                systemStatus.textContent = "NORMAL";

            }


            /* ALERTS EXIST */

            else {

                alerts.forEach(alert => {

                    /* DISPLAY ALERT */

                    alertList.innerHTML += `
                        <div class="alert-item warning-alert">
                            <div>
                                <strong>${alert.title}</strong>
                                <p>${alert.message}</p>
                            </div>
                            <span>Active</span>
                        </div>
                    `;


                    /* CREATE UNIQUE ALERT KEY */

                    const alertKey =
                        alert.title + alert.message;


                    /* SAVE ONLY ONCE */

                    if (!savedAlerts.has(alertKey)) {

                        savedAlerts.add(alertKey);


                        fetch("http://127.0.0.1:5000/alerts", {

                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                alert_type: alert.title,

                                message: alert.message,

                                status: "Active"

                            })

                        })

                        .then(response => response.json())

                        .then(data => {

                            console.log(
                                "Alert saved:",
                                data
                            );

                        })

                        .catch(error => {

                            console.error(
                                "Alert save error:",
                                error
                            );

                        });

                    }

                });


                activeAlerts.textContent =
                    alerts.length;

                totalAlertsElement.textContent =
                    alerts.length;

                systemStatus.textContent =
                    "ATTENTION";

            }

        })

        .catch(error => {

            console.error(
                "Alerts API Error:",
                error
            );

        });

}


/* FIRST CHECK */

checkAlerts();


/* CHECK EVERY 5 SECONDS */

setInterval(checkAlerts, 5000);