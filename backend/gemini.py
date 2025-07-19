# gemini.py
# This file ALSO contains the functions that do all the data processing and graph algorithms


import os
import google.generativeai as genai
from dotenv import load_dotenv
import random_assets
import json


# set "interaction_type" to "none", "severity" to "none", and "advanced_info" to "No known interaction found between these drugs.", and add research links that show evidence that these two drugs are safe.

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')

def get_food_interactions(drug_name1, din1, patient_data):
    """
    Returns a list of all food interactions with the given drug object as edges.
    This function is a placeholder for future implementation.
    """
    foods = []
    for node in patient_data['nodes']: # Get the names of already listed foods
        if 'din' in node:
            print(f"Skipping node {node} as it is a drug with DIN {node['din']}")
            continue
        foods.append(node.get('name', 'Unknown Food'))

    if len(foods) == 0:
        print("foods empty")
        subprompt = f"""If there are any clinically significant harmful interactions with common foods or non-pharmaceutical substances (such as alcohol, tobacco, or recreational/illicit drugs) NOT already listed, add an edge object for each of those, wherein the name field will be a short, concise name of the food or substance i.e. "apples", or "marijuana", etc."""
        subprompt = subprompt.strip()
        subprompt2 = """REMEMBER THE CASES OF THE EXISTING FOODS, AS THEY ARE CASE SENSITIVE AND FORM SENSITIVE. DO NOT CHANGE THE CASES OF THE EXISTING FOODS."""
    else:
        print("foods not empty")
        subprompt = f"""For each substance in this list: [{', '.join(foods)}], determine if there is a clinically noteworthy harmful interaction with the drug. If there is, create an edge object describing the interaction. If there is **no significant harmful interaction**, do NOT include that substance. REMEMBER THE NAME FIELD FOR THE NEW JSON OBJECT, AS IT IS CASE SENSITIVE AND FORM SENSITIVE.
In addition, if there are any other clinically significant harmful interactions with common foods or non-pharmaceutical substances (such as alcohol, tobacco, or recreational/illicit drugs) NOT already listed, add an additional edge object for each of those, wherein the name field will be a short, concise name of the food or substance i.e. "apples", or "marijuana", etc."""
        subprompt = subprompt.strip()
        subprompt2 = ""


# -------------------------

    prompt = f"""
You are a pharmaceutical expert AI assistant.

Given a drug with Drug Name: {drug_name1} and Canadian DIN number {din1}, answer the following:

{subprompt}

Return your answer strictly as a single JSON array. Each object in the array should have:

{{
    "din1": String,               # Canadian Drug Identification Number
    "name": String,               # Name of the food or other substance. {subprompt2}
    "interaction_type": String,   # Type of interaction (e.g. "delayed absorption", "increased side effects", "nausea", "bleeding". THIS IS LIMITED TO 5 WORDS MAX)
    "severity": String,           # Severity ("mild", "moderate", "severe"). DO NOT overstate the severity. If there may be only cause for concern, label it as "mild" or "moderate" at most.
    "advanced_info": String,      # Scientifically accurate but CONCISE, EASY TO UNDERSTAND, layman-friendly description of the interaction
    "research_links": [           # List of links to research or reference articles (HIGHLY ENCOURAGED)
        "https://example.com/research1"
    ]
}}

Return ONLY the JSON array. Do not include any foods/substances with no noteworthy interaction. If there are no noteworthy interactions, return an empty array: [].
"""



    response = model.generate_content(prompt)
    clean = response.text.strip('`json\n').strip('`')
    print(f"Gemini response: {clean}")  # Debugging output
    # response.text or response.content depends on your Gemini SDK, but you want the raw model output
    try:
        data = json.loads(clean)
    except Exception:
        # return error if JSON parsing fails
        return {"error": "Failed to parse Gemini response. Please check the API key and response format."}
    return data
    

def get_all_interactions(drug_object, patient_data):
    """
    Returns a list of all drug interactions between the patient's drugs and the given drug object as edges.
    """
    drug_name1 = drug_object['drug_name']
    din1 = drug_object['din']
    drug_names2 = []
    for node in patient_data['nodes']:
        if 'din' not in node:
            print(f"Skipping node {node} as it does not have a 'din' field")
            continue
        if node['din'] == drug_object['din']:
            continue  # Skip the drug itself
        drug_names2.append('('+node['drug_name']+','+node['din']+')')
    concatenated = '{ ' + ','.join(pair for pair in drug_names2) + ' }'
    #     print(f"Checking interaction between {drug_object['drug_name']} and {node['drug_name']}")
    #     interaction = get_drug_interactions(
    #         drug_name1=drug_object['drug_name'],
    #         drug_name2=node['drug_name'],
    #         din1=drug_object['din'],
    #         din2=node['din']
    #     )
    #     if 'error' in interaction:
    #         print(f"Error fetching interaction for {drug_object['drug_name']} and {node['drug_name']}: {interaction['error']}")
    #         continue # skip this interaction if there's an error
    #     if 'none' in interaction :
    #         print(f"No significant interaction found between {drug_object['drug_name']} and {node['drug_name']}")
    #         continue  # skip this interaction if there's no significant interaction
    #     interactions.append(interaction)
    # return interactions
    prompt = f"""
You are a pharmaceutical expert AI assistant.

Given a drug with Drug Name: {drug_name1} and Canadian DIN number {din1}, please find and summarize any drug interactions between it and each of the following drug-din pairs: {concatenated}.

Return your answer **strictly as a JSON LIST** of objects with these fields, one object in the list for each drug-din pair:
{{
    "din1": String,  # Canadian Drug Identification Number of the first drug
    "din2": String,  # Canadian Drug Identification Number of the second drug
    "drug_name1": String,  # Name of the first drug
    "drug_name2": String,  # Name of the second drug
    "interaction_type": String,  # Type of interaction (Example: Delayed absorption, Increased side effects, prolongation or bleeding. THIS IS LIMITED TO 5 WORDS MAX)
    "severity": String,  # Severity (ONLY ONE OF "mild", "moderate", or "major" DO NOT USE any weird combinations or other values)
    "advanced_info": String,  # Concise, layperson-friendly, FACTUAL summary of the interaction. MAKE THIS AS CONCISE AND EASY TO UNDERSTAND AS POSSIBLE. EXPLAIN THE INTERACTION IN SIMPLE TERMS.
    "research_links": [      # List of real, publicly accessible research papers or authoritative sources supporting either the interaction or the safety of these drugs together
        "https://example.com/research1",
        "https://example.com/research2"
    ]
}}

If no interaction is found, or if they are safe to take together, omit them from the list. If the list is empty, return an empty JSON array: [].
If two drugs are commonly co-prescribed, DO NOT overstate the severity. If there may be cause for concern, label it as "mild" or "moderate" at most.
If you cannot find enough information such that you deem your search inconclusive, or encounter any other error such that you cannot complete this request, return this EXACT JSON object: {{"error": "Inconclusive search"}}

Strictly output only the JSON list. Do not add any explanation or text outside the JSON object.
    """.strip()
    print(f"Prompt for Gemini: {prompt}")  # Debugging output
    response = model.generate_content(prompt)
    clean = response.text.strip('`json\n').strip('`')
    print(f"Gemini response: {clean}")  # Debugging output
    # response.text or response.content depends on your Gemini SDK, but you want the raw model output
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
        print("testing : this should say alcohol is bad")
        print(get_food_interactions("Acetaminophen", "02443562", random_assets.sample_patients[0]))

        print("testing : this should say nothing")
        print(get_food_interactions("Albuterol", "02445555", random_assets.sample_patients[0]))
        # print(get_drug_interactions("Ibuprofen","Warfarin", "02443562", "02242924"))
        # print("this pair should be good for u:")
        # print(get_drug_interactions("TYLENOL 325MG TABLET", "CLARITIN 10MG TABLET", "02046040", "00782696"))

        # # test getting interactions of two of the same drug
        # print("this pair should be inconclusive:")
        # print(get_drug_interactions("Ibuprofen", "Ibuprofen", "02443562", "02443562"))
    else:
        print("Failed to connect to Gemini API. Check your API key in .env file.")
