from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from twilio.rest import Client

# Initialize Flask App
app = Flask(__name__)

# Enable CORS with specific configurations
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the trained model and preprocessing objects
try:
    model = joblib.load("fee_payment_model.pkl")
    scaler = joblib.load("scaler (2).pkl")
    label_encoder = joblib.load("label_encoder.pkl")
except Exception as e:
    print(f"Error loading model or preprocessing files: {e}")

# Twilio Credentials (Replace with actual credentials)
TWILIO_SID = "AC0b3aa784ac8f6b505a00f5e25a195ab8"
TWILIO_AUTH_TOKEN = "88c75c592d2d5f9f659c5bdc28ee3620"
TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"  # Twilio Sandbox Number
YOUR_WHATSAPP_NUMBER = "whatsapp:+917715816304"  # Recipient's Number

# Initialize Twilio Client
try:
    client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)
except Exception as e:
    print(f"Error initializing Twilio client: {e}")

# Define Features for Prediction
features = ["Semester", "Total_Fees", "Fees_Paid", "Due_Amount", "Delay_Days", "Late_Payments_Count", "Payment_Gap"]

# Function to Predict Payment Behavior
def predict_fee_payment(student_data):
    try:
        student_df = pd.DataFrame([student_data], columns=features)
        student_scaled = scaler.transform(student_df)
        prediction = model.predict(student_scaled)
        return label_encoder.inverse_transform(prediction)[0]
    except Exception as e:
        print(f"Prediction Error: {e}")
        return "Error"

# Function to Send WhatsApp Reminder
def send_whatsapp_reminder(student_name, due_amount, delay_days):
    try:
        message_body = f"📢 Reminder: Dear {student_name}, you have an outstanding fee of ₹{due_amount}. You are overdue by {delay_days} days. Please pay at the earliest to avoid penalties."
        
        message = client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            body=message_body,
            to=YOUR_WHATSAPP_NUMBER
        )
        print(f"WhatsApp Reminder Sent: {message.sid}")
        return {"status": "success", "message_sid": message.sid}
    except Exception as e:
        print(f"Twilio Error: {e}")
        return {"status": "error", "message": str(e)}

# API Endpoint to Handle OPTIONS Requests (Preflight)
@app.route("/send_reminder", methods=["OPTIONS"])
def handle_options():
    response = jsonify({"message": "CORS Preflight Passed"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

# API Endpoint to Send Reminder
@app.route("/send_reminder", methods=["POST"])
def send_reminder():
    try:
        data = request.json  # Receive student data from frontend
        
        # Validate Incoming Data
        required_keys = ["Name", "Due_Amount", "Delay_Days"] + features
        for key in required_keys:
            if key not in data:
                return jsonify({"error": f"Missing field: {key}"}), 400

        student_name = data["Name"]
        due_amount = data["Due_Amount"]
        delay_days = data["Delay_Days"]

        # Predict Payment Status
        payment_status = predict_fee_payment(data)

        # Send WhatsApp Reminder if Unpaid or Delay > 5 Days
        if payment_status == "Unpaid" or delay_days > 5:
            return jsonify(send_whatsapp_reminder(student_name, due_amount, delay_days))

        return jsonify({"status": "no_reminder", "message": "No reminder needed."})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# Run Flask App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
