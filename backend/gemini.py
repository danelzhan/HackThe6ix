# gemini.py
# This file ALSO contains the functions that do all the data processing and graph algorithms


import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')


def parse_new_user(patient_data):
    """
    Parse new patient data, 
    
    Args:
        patient_data (dict): Raw patient data from request (id, name, age, sex, doctor SHOULD BE FILLED OUT)
        
    Returns:
        dict: Parsed patient data with required fields
    """
    parsed_data = {
        "_id": patient_data.get('_id'),
        "name": patient_data.get('name'),
        "age": patient_data.get('age'),
    }


def get_drug_interactions(drug_name1, drug_name2):
    """
    Consults Gemini to get drug interactions between two DINS.
    Returns a dict in the format:
    {
        "din1": String,
        "din2": String,
        "drug_name1": String,
        "drug_name2": String,
        "interaction_type": String,
        "severity": String,
        "advanced_info": String,
        "research_links": [ ... ]
    }
    """
    prompt = f"""
You are a pharmaceutical expert AI assistant.

Given two drugs with Drug Names: {drug_name1} and {drug_name2}, please find and summarize any drug interactions between them.

Return your answer **strictly as a single JSON object** with these fields:
{{
    "din1": String,  # Canadian Drug Identification Number of the first drug
    "din2": String,  # Canadian Drug Identification Number of the second drug
    "drug_name1": String,  # Name of the first drug
    "drug_name2": String,  # Name of the second drug
    "interaction_type": String,  # Type of interaction (e.g., "antagonistic", "synergistic")
    "severity": String,  # Severity ("mild", "moderate", or "severe")
    "advanced_info": String,  # Concise, layperson-friendly, FACTUAL summary of the interaction. MAKE THIS AS CONCISE AND EASY TO UNDERSTAND AS POSSIBLE. EXPLAIN THE INTERACTION IN SIMPLE TERMS.
    "research_links": [      # List of real, publicly accessible research papers or authoritative sources supporting this interaction
        "https://example.com/research1",
        "https://example.com/research2"
    ]
}}

If no interaction is found, set "interaction_type" to "none", "severity" to "none", and "advanced_info" to "No known interaction found between these drugs.", and leave "research_links" as an empty list.
If you cannot find enough information such that you deem your search inconclusive, or encounter any other error such that you cannot complete this request, return this EXACT JSON object: {{"error": "Inconclusive search"}}

Strictly output only the JSON. Do not add any explanation or text outside the JSON object.
    """.strip()

    response = model.generate_content(prompt)
    clean = response.text.strip('`json\n').strip('`')
    print(f"Gemini response: {clean}")  # Debugging output
    # response.text or response.content depends on your Gemini SDK, but you want the raw model output
    import json
    try:
        data = json.loads(clean)
    except Exception:
        # return error if JSON parsing fails
        return {"error": "Failed to parse Gemini response. Please check the API key and response format."}
    return data












def send_gemini_prompt(prompt): # Low level function to send a prompt to Gemini
    """
    Send a simple text prompt to Gemini and return the response.
    
    Args:
        prompt (str): The text prompt to send to Gemini
        
    Returns:
        str: The response text from Gemini
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error sending prompt to Gemini: {e}")
        return None

# Test function
def test_gemini_connection():
    """
    Test the Gemini API connection.
    
    Returns:
        bool: True if connection successful, False otherwise
    """
    try:
        response = send_gemini_prompt("Hello, can you respond with 'Connection successful'?")
        return response is not None
    except Exception as e:
        print(f"Connection test failed: {e}")
        return False

if __name__ == "__main__":
    # Test the connection
    if test_gemini_connection():
        print("Gemini API connection successful!")
        print("this pair should be bad for u:")
        print(get_drug_interactions("Ibuprofen","Warfarin"))
        print("this pair should be good for u:")
        print(get_drug_interactions("TYLENOL 325MG TABLET", "CLARITIN 10MG TABLET"))
    else:
        print("Failed to connect to Gemini API. Check your API key in .env file.")
