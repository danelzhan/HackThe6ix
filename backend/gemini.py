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


def get_drug_interactions(din1, din2):
    """
    Consults Gemini to get drug interactions between two DINS.
    Returns a dict in the format:
    {
        "din1": Int,
        "din2": Int,
        "interaction_type": String,
        "severity": String,
        "advanced_info": String,
        "research_links": [ ... ]
    }
    """
    prompt = f"""
You are a pharmaceutical expert AI assistant.

Given two drugs with Drug Identification Numbers (DINs): {din1} and {din2}, please find and summarize any drug interactions between them.

Return your answer **strictly as a single JSON object** with these fields:
{{
    "din1": Int,  # Drug Identification Number of the first drug
    "din2": Int,  # Drug Identification Number of the second drug
    "interaction_type": String,  # Type of interaction (e.g., "antagonistic", "synergistic")
    "severity": String,  # Severity ("mild", "moderate", or "severe")
    "advanced_info": String,  # Concise, layperson-friendly, science-based summary of the interaction
    "research_links": [      # List of real, publicly accessible research papers or authoritative sources supporting this interaction
        "https://example.com/research1",
        "https://example.com/research2"
    ]
}}

If no interaction is found, set "interaction_type" to "none", "severity" to "none", and "advanced_info" to "No known interaction found between these drugs.", and leave "research_links" as an empty list.

Strictly output only the JSON. Do not add any explanation or text outside the JSON object.
    """.strip()

    response = model.generate_content(prompt)
    # response.text or response.content depends on your Gemini SDK, but you want the raw model output
    import json
    try:
        data = json.loads(response.text)
    except Exception:
        # fallback: try to extract the first JSON object
        import re
        m = re.search(r'\{.*\}', response.text, re.DOTALL)
        data = json.loads(m.group(0)) if m else None
    return data











def send_gemini_prompt(prompt):
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

def send_gemini_chat(messages):
    """
    Send a chat conversation to Gemini.
    
    Args:
        messages (list): List of message dictionaries with 'role' and 'content'
        
    Returns:
        str: The response text from Gemini
    """
    try:
        chat = model.start_chat(history=[])
        
        # Send all messages except the last one as history
        for message in messages[:-1]:
            chat.send_message(message['content'])
        
        # Send the final message and get response
        response = chat.send_message(messages[-1]['content'])
        return response.text
    except Exception as e:
        print(f"Error in chat with Gemini: {e}")
        return None

def analyze_medical_data(patient_data, question="Analyze this medical data"):
    """
    Analyze medical data using Gemini.
    
    Args:
        patient_data (dict): Patient data to analyze
        question (str): Specific question about the data
        
    Returns:
        str: Analysis from Gemini
    """
    prompt = f"""
    {question}
    
    Patient Data:
    {patient_data}
    
    Please provide a medical analysis based on this data.
    """
    
    return send_gemini_prompt(prompt)

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
        
        # Example usage
        sample_response = send_gemini_prompt("What is machine learning?")
        print(f"Sample response: {sample_response}")
    else:
        print("Failed to connect to Gemini API. Check your API key in .env file.")
