const closeButton = document.querySelector(".close-sidebar");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector(".sidebar");
const header = document.querySelector(".dashboard-header");
const container = document.querySelector(".settings-container");


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
   SETTINGS TOGGLES
-------------------------------- */

const telemetryToggle =
    document.getElementById("telemetryToggle");

const alertToggle =
    document.getElementById("alertToggle");

const refreshToggle =
    document.getElementById("refreshToggle");

const notificationToggle =
    document.getElementById("notificationToggle");


/* -------------------------------
   LOAD SETTINGS FROM MYSQL
-------------------------------- */

function loadSettings() {

    fetch("http://127.0.0.1:5000/settings")

        .then(response => response.json())

        .then(data => {

            telemetryToggle.checked =
                Boolean(data.telemetry_monitoring);

            alertToggle.checked =
                Boolean(data.alert_monitoring);

            refreshToggle.checked =
                Boolean(data.auto_refresh);

            notificationToggle.checked =
                Boolean(data.notifications);

        })

        .catch(error => {

            console.error(
                "Settings API Error:",
                error
            );

        });
}


/* -------------------------------
   SAVE SETTINGS TO MYSQL
-------------------------------- */

function saveSettings() {

    fetch("http://127.0.0.1:5000/settings", {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            telemetry_monitoring:
                telemetryToggle.checked,

            alert_monitoring:
                alertToggle.checked,

            auto_refresh:
                refreshToggle.checked,

            notifications:
                notificationToggle.checked

        })

    })

    .then(response => response.json())

    .then(data => {

        console.log(
            "Settings saved:",
            data
        );

    })

    .catch(error => {

        console.error(
            "Settings save error:",
            error
        );

    });
}


/* -------------------------------
   TOGGLE EVENTS
-------------------------------- */

telemetryToggle.addEventListener("change", function () {

    console.log(
        "Telemetry Monitoring:",
        this.checked ? "Enabled" : "Disabled"
    );

    saveSettings();

});


alertToggle.addEventListener("change", function () {

    console.log(
        "Alert Monitoring:",
        this.checked ? "Enabled" : "Disabled"
    );

    saveSettings();

});


refreshToggle.addEventListener("change", function () {

    console.log(
        "Auto Refresh:",
        this.checked ? "Enabled" : "Disabled"
    );

    saveSettings();

});


notificationToggle.addEventListener("change", function () {

    console.log(
        "System Notifications:",
        this.checked ? "Enabled" : "Disabled"
    );

    saveSettings();

});


/* -------------------------------
   INITIAL LOAD
-------------------------------- */

loadSettings();