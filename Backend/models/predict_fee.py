import sys
import json

def predict_fee(student_details):
    """
    Predicts the tuition fee based on student details.
    """
    if not isinstance(student_details, dict):
        return {"error": "Invalid input format"}

    # Check required fields
    required_fields = ["course", "income", "scholarship"]
    if not all(field in student_details for field in required_fields):
        return {"error": "Missing required fields"}

    course = student_details["course"].lower()
    income = student_details["income"]
    scholarship = student_details["scholarship"]

    # Example fee prediction logic
    base_fee = {
        "engineering": 500000,
        "medical": 700000,
        "arts": 200000,
        "science": 300000
    }

    # Default fee if course not found
    predicted_fee = base_fee.get(course, 400000)

    # Adjust fee based on income and scholarship
    if income < 300000:
        predicted_fee *= 0.8  # 20% discount for low-income students
    if scholarship:
        predicted_fee *= 0.7  # 30% discount for scholarship holders

    return {"predicted_fee": predicted_fee}

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = sys.stdin.read().strip()
        
        # Parse JSON input
        student_details = json.loads(input_data)

        # Run prediction function
        result = predict_fee(student_details)

        # Print JSON output
        print(json.dumps(result))
    
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
