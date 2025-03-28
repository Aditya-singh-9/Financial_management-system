import json

# Example spending categories (Replace with real data processing logic)
spending_patterns = {
    "Rent": 40,
    "Food": 20,
    "Transport": 10,
    "Savings": 15,
    "Entertainment": 10,
    "Others": 5,
}

insights = {
    "Savings": "Your savings ratio is low, try to save at least 20% of your income.",
    "Food": "Food expenses are high, consider meal planning.",
    "Transport": "Consider using public transport to reduce costs.",
}

# Return result as JSON
print(json.dumps({"spending_patterns": spending_patterns, "insights": insights}))
