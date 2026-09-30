const closeButton = document.querySelector(".close-sidebar");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".dashboard-header");
const container = document.querySelector(".telemetry-container");

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
   TELEMETRY CHART
-------------------------------- */

const ctx = document.getElementById("telemetryChart");

const telemetryChart = new Chart(ctx, {
    type: "line",

    data: {
        labels: [],

        datasets: [
            {
                label: "Temperature (°C)",
                data: [],
                borderWidth: 2,
                tension: 0.3
            },

            {
                label: "Battery (%)",
                data: [],
                borderWidth: 2,
                tension: 0.3
            },

            {
                label: "Signal Strength (%)",
                data: [],
                borderWidth: 2,
                tension: 0.3
            }
        ]
    },

    options: {
        responsive: true,

        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});


/* -------------------------------
   UPDATE TELEMETRY + CHART
-------------------------------- */

function updateAll() {

    fetch("http://127.0.0.1:5000/telemetry")

        .then(response => response.json())

        .then(data => {

            if (data.length === 0) return;

            const latest = data[0];


            /* TELEMETRY CARDS */

            document.getElementById("temperature").textContent =
                latest.temperature + " °C";

            document.getElementById("battery").textContent =
                latest.battery + " %";

            document.getElementById("pressure").textContent =
                latest.pressure + " kPa";

            document.getElementById("signal").textContent =
                latest.signal_strength + " %";

            document.getElementById("altitude").textContent =
                latest.altitude + " km";

            document.getElementById("velocity").textContent =
                latest.velocity + " km/s";

            document.getElementById("power").textContent =
                latest.power + " W";

            document.getElementById("orientation").textContent =
                latest.orientation + " °";

            document.getElementById("packetsSent").textContent =
                latest.packets_sent;

            document.getElementById("packetsReceived").textContent =
                latest.packets_received;

            document.getElementById("communicationStatus").textContent =
                latest.signal_strength >= 80
                    ? "ONLINE"
                    : "STABLE";

            document.getElementById("lastUpdated").textContent =
                new Date().toLocaleTimeString();


            /* UPDATE CHART */

            const time = new Date().toLocaleTimeString();

            telemetryChart.data.labels.push(time);

            telemetryChart.data.datasets[0].data.push(
                Number(latest.temperature)
            );

            telemetryChart.data.datasets[1].data.push(
                Number(latest.battery)
            );

            telemetryChart.data.datasets[2].data.push(
                Number(latest.signal_strength)
            );


            /* KEEP ONLY LAST 10 VALUES */

            if (telemetryChart.data.labels.length > 10) {

                telemetryChart.data.labels.shift();

                telemetryChart.data.datasets[0].data.shift();

                telemetryChart.data.datasets[1].data.shift();

                telemetryChart.data.datasets[2].data.shift();
            }


            telemetryChart.update();

        })

        .catch(error => {

            console.error(
                "Telemetry API Error:",
                error
            );

        });
}


/* -------------------------------
   START REAL-TIME UPDATES
-------------------------------- */

updateAll();

setInterval(updateAll, 3000);