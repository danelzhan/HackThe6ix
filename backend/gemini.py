# gemini.py
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
