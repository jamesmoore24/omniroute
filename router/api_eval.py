import requests

# Define the endpoint URL
url = "http://0.0.0.0:8000/predict"  # Replace 'your-endpoint' with the actual endpoint path

# Create a generic prompt with the correct field name
data = {
    #"text": "Hello!"
    "text": "What is the square root of 123456789?"
    #"text": "What is the capital of France?"
    #"text": "Janet\u2019s ducks lay 16 eggs per day. She eats three for breakfast every morning and bakes muffins for her friends every day with four. She sells the remainder at the farmers' market daily for $2 per fresh duck egg. How much in dollars does she make every day at the farmers' market?", "answer": "Janet sells 16 - 3 - 4 = <<16-3-4=9>>9 duck eggs a day.\nShe makes 9 * 2 = $<<9*2=18>>18 every day at the farmer\u2019s market.\n#### 18"
}

# Send the POST request
response = requests.post(url, json=data)

# Print the response
print("Status Code:", response.status_code)
print("Response JSON:", response.json())