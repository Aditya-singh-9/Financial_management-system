import sys
import json

try:
    # Read input from stdin
    input_data = sys.stdin.read().strip()
    
    # Check if input_data is empty
    if not input_data:
        raise ValueError("No input received")
    
    # Parse JSON input
    data = json.loads(input_data)
    
    # Ensure required key exists
    if "expenses" not in data:
        raise ValueError("Missing 'expenses' key in input")

    expenses = data["expenses"]

    # Sample budget prediction logic (change as per requirement)
    predicted_budget = expenses * 1.2  # Example: Adding 20% buffer

    # Return response in JSON format
    print(json.dumps({"predicted_budget": predicted_budget}))

except Exception as e:
    print(json.dumps({"error": str(e)}))
