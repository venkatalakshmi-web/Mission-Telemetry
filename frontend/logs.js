const closeButton = document.querySelector(".close-sidebar");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".dashboard-header");
const container = document.querySelector(".logs-container");

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


let totalEvents = 0;
let telemetryUpdates = 0;

const events = [
    "Telemetry data received",
    "Temperature reading updated",
    "Battery status checked",
    "Signal strength monitored",
    "System health check completed",
    "Communication link verified"
];


/* -------------------------------
   LOAD LOGS FROM MYSQL
-------------------------------- */

function loadLogs() {

    fetch("http://127.0.0.1:5000/logs")

        .then(response => response.json())

        .then(data => {

            const logList =
                document.getElementById("logList");

            logList.innerHTML = "";

            totalEvents = data.length;

            telemetryUpdates = data.length;


            data.forEach(log => {

                const newLog =
                    document.createElement("div");

                newLog.className = "log-row";

                const time =
                    new Date(log.timestamp)
                        .toLocaleTimeString();

                newLog.innerHTML = `
                    <span>${time}</span>
                    <span>${log.event}</span>
                    <strong>${log.status}</strong>
                `;

                logList.appendChild(newLog);
            });


            document.getElementById("totalEvents").textContent =
                totalEvents;

            document.getElementById("telemetryUpdates").textContent =
                telemetryUpdates;

        })

        .catch(error => {

            console.error(
                "Logs API Error:",
                error
            );

        });
}


/* -------------------------------
   ADD NEW LOG
-------------------------------- */

function addLog() {

    const event =
        events[Math.floor(Math.random() * events.length)];


    fetch("http://127.0.0.1:5000/logs", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            event: event,

            status: "INFO"

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(
            "Log saved:",
            data
        );

        loadLogs();

    })

    .catch(error => {

        console.error(
            "Log save error:",
            error
        );

    });
}


/* -------------------------------
   FIRST LOAD
-------------------------------- */

loadLogs();


/* -------------------------------
   ADD NEW LOG EVERY 4 SECONDS
-------------------------------- */

setInterval(addLog, 4000);