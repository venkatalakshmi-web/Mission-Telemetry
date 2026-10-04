from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import psutil
import random
import threading
from datetime import datetime


app = Flask(__name__)
CORS(app)


# --------------------------------
# MYSQL CONNECTION
# --------------------------------

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="mission_telemetry"
)


def ensure_db_connection():

    global db

    try:

        db.ping(
            reconnect=True,
            attempts=3,
            delay=1
        )

    except mysql.connector.Error:

        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="mission_telemetry"
        )


# --------------------------------
# TELEMETRY GENERATION LOCK
# --------------------------------

telemetry_lock = threading.Lock()


# --------------------------------
# HOME
# --------------------------------

@app.route("/")
def home():

    return "Mission Telemetry Backend + MySQL Connected!"


# --------------------------------
# REGISTER USER
# --------------------------------

@app.route("/register", methods=["POST"])
def register():

    ensure_db_connection()

    data = request.json

    full_name = data["full_name"]
    username = data["username"]
    password = data["password"]

    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE username = %s",
        (username,)
    )

    existing_user = cursor.fetchone()

    if existing_user:

        cursor.close()

        return jsonify({
            "message": "Username already exists"
        }), 409

    cursor.execute(
        """
        INSERT INTO users
        (full_name, username, password)
        VALUES (%s, %s, %s)
        """,
        (
            full_name,
            username,
            password
        )
    )

    db.commit()

    cursor.close()

    return jsonify({
        "message": "Registration successful"
    }), 201


# --------------------------------
# LOGIN USER
# --------------------------------

@app.route("/login", methods=["POST"])
def login():

    ensure_db_connection()

    data = request.json

    username = data["username"]
    password = data["password"]

    cursor = db.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT id, full_name, username
        FROM users
        WHERE username = %s
        AND password = %s
        """,
        (
            username,
            password
        )
    )

    user = cursor.fetchone()

    cursor.close()

    if user:

        return jsonify({
            "message": "Login successful",
            "user": user
        }), 200

    return jsonify({
        "message": "Invalid username or password"
    }), 401


# --------------------------------
# RESET PASSWORD
# --------------------------------

@app.route("/reset-password", methods=["PUT"])
def reset_password():

    ensure_db_connection()

    data = request.json

    username = data["username"]
    new_password = data["new_password"]

    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE username = %s",
        (username,)
    )

    user = cursor.fetchone()

    if not user:

        cursor.close()

        return jsonify({
            "message": "Username not found"
        }), 404

    cursor.execute(
        """
        UPDATE users
        SET password = %s
        WHERE username = %s
        """,
        (
            new_password,
            username
        )
    )

    db.commit()

    cursor.close()

    return jsonify({
        "message": "Password reset successful"
    }), 200


# --------------------------------
# USERS
# --------------------------------

@app.route("/users")
def users():

    ensure_db_connection()

    cursor = db.cursor()

    cursor.execute(
        "SELECT * FROM users"
    )

    data = cursor.fetchall()

    cursor.close()

    return str(data)


# --------------------------------
# GENERATE TELEMETRY
# --------------------------------

def generate_telemetry():

    ensure_db_connection()

    cursor = db.cursor()

    temperature = round(
        random.uniform(25, 32),
        2
    )

    pressure = round(
        random.uniform(99, 103),
        2
    )

    signal_strength = round(
        random.uniform(80, 95),
        2
    )

    altitude = round(
        random.uniform(418, 423),
        2
    )

    velocity = round(
        random.uniform(7.5, 8.2),
        2
    )

    power = round(
        random.uniform(60, 70),
        2
    )

    orientation = round(
        random.uniform(10, 15),
        2
    )

    packets_sent = random.randint(
        1000,
        10000
    )

    packets_received = random.randint(
        950,
        packets_sent
    )

    cursor.execute(
        """
        INSERT INTO telemetry
        (
            temperature,
            battery,
            pressure,
            signal_strength,
            altitude,
            velocity,
            power,
            orientation,
            packets_sent,
            packets_received
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s,
            %s
        )
        """,
        (
            temperature,
            None,
            pressure,
            signal_strength,
            altitude,
            velocity,
            power,
            orientation,
            packets_sent,
            packets_received
        )
    )

    db.commit()

    cursor.close()


# --------------------------------
# TELEMETRY
# --------------------------------

@app.route("/telemetry")
def telemetry():

    ensure_db_connection()

    with telemetry_lock:

        cursor = db.cursor(
            dictionary=True
        )

        # Get latest telemetry record
        cursor.execute(
            """
            SELECT *
            FROM telemetry
            ORDER BY timestamp DESC
            LIMIT 1
            """
        )

        latest = cursor.fetchone()

        cursor.close()


        # Generate new data only if
        # latest record is older than 3 seconds

        should_generate = False

        if latest is None:

            should_generate = True

        else:

            latest_time = latest["timestamp"]

            current_time = datetime.now()

            time_difference = (
                current_time - latest_time
            ).total_seconds()

            if time_difference >= 3:

                should_generate = True


        if should_generate:

            generate_telemetry()


    # Fetch latest telemetry record
    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM telemetry
        ORDER BY timestamp DESC
        LIMIT 20
        """
    )

    data = cursor.fetchall()

    cursor.close()


    # Laptop battery
    battery = psutil.sensors_battery()

    if battery and data:

        data[0]["battery"] = round(
            battery.percent,
            2
        )

        data[0]["charging"] = (
            battery.power_plugged
        )


    return jsonify(data)


# --------------------------------
# ALERTS
# --------------------------------

@app.route("/alerts", methods=["POST"])
def add_alert():

    global db

    data = request.json

    try:

        ensure_db_connection()

        cursor = db.cursor()

    except mysql.connector.Error:

        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="mission_telemetry"
        )

        cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO alerts
        (alert_type, message, status)
        VALUES (%s, %s, %s)
        """,
        (
            data["alert_type"],
            data["message"],
            data["status"]
        )
    )

    db.commit()

    cursor.close()

    return jsonify({
        "message": "Alert saved successfully"
    })


# --------------------------------
# ADD LOG
# --------------------------------

@app.route("/logs", methods=["POST"])
def add_log():

    ensure_db_connection()

    data = request.json

    cursor = db.cursor()

    cursor.execute(
        """
        INSERT INTO mission_logs
        (event, status)
        VALUES (%s, %s)
        """,
        (
            data["event"],
            data["status"]
        )
    )

    db.commit()

    cursor.close()

    return jsonify({
        "message": "Log saved successfully"
    })


# --------------------------------
# GET LOGS
# --------------------------------

@app.route("/logs", methods=["GET"])
def get_logs():

    ensure_db_connection()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM mission_logs
        ORDER BY timestamp DESC
        LIMIT 20
        """
    )

    data = cursor.fetchall()

    cursor.close()

    return jsonify(data)


# --------------------------------
# GET SETTINGS
# --------------------------------

@app.route("/settings", methods=["GET"])
def get_settings():

    ensure_db_connection()

    cursor = db.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM settings
        ORDER BY id DESC
        LIMIT 1
        """
    )

    data = cursor.fetchone()

    cursor.close()

    return jsonify(data)


# --------------------------------
# UPDATE SETTINGS
# --------------------------------

@app.route("/settings", methods=["PUT"])
def update_settings():

    ensure_db_connection()

    data = request.json

    cursor = db.cursor()

    cursor.execute(
        """
        UPDATE settings
        SET telemetry_monitoring = %s,
            alert_monitoring = %s,
            auto_refresh = %s,
            notifications = %s
        WHERE id = 1
        """,
        (
            data["telemetry_monitoring"],
            data["alert_monitoring"],
            data["auto_refresh"],
            data["notifications"]
        )
    )

    db.commit()

    cursor.close()

    return jsonify({
        "message": "Settings updated successfully"
    })


# --------------------------------
# START SERVER
# --------------------------------

if __name__ == "__main__":

    app.run(
        debug=True,
        use_reloader=False
    )