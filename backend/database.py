# db.py
import os
from bson.objectid import ObjectId
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
import json
from bson import json_util
load_dotenv()  # loads from .env automatically


MONGO_USER = os.getenv('MONGO_USER', '')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD', '')

uri = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@cluster0.1iw4ni6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


# DOCUMENTATION ----------- for passed objects for api endpts
# Patient structure:
# {
#     "_id": String, # USE THE EMAIL token from Auth0 !!! to be able to fetch user info
#                    # The _id is special to mongodb storage in that it is the token used to search for the right json object
#     "name": String,
#     "age": Number,
#     "sex": String, # "male" or "female"
#     "doctor": String, # name of the doctor
#     "nodes": [ # List of prescribed drugs
#         {
#             "drug_name": String, # Example drug entry
#             "din": String, # Drug Identification Number
#             "dosage": String,
#             "frequency": String,
#             "category": String,
#             "time_taken": String, # format: "HH:MM" (24-hour format)
#             "start_date": String, # format: "YYYY-MM-DD"
#             "end_date": String, # format: "YYYY-MM-DD"
#             "notes": String
#         }, 
#         ...
#     ],
#     "edges": [ # list of drug interactions
#         {
#             "din1": String, # Drug Identification Number of the first drug
#             "din2": String, # Drug Identification Number of the second drug
#             "drug_name1": String, # Name of the first drug
#             "drug_name2": String, # Name of the second drug
#             "interaction_type": String, # Type of interaction (Example: Delayed absorption, Increased side effects, prolongation or bleeding)
#             "severity": String, # Severity of the interaction ("mild", "moderate", "severe")
#             "advanced_info": String, # Additional information description about the interaction
#             "research_links": [ # List of links to research papers or articles about the interaction
#                 "https://example.com/research1",
#                 "https://example.com/research2"
#             ]
#         },
#         ...
#     ],
#     "medical_history": [
#         {
#             "condition": String,
#             "diagnosis_date": String, # format: "YYYY-MM-DD"
#             "treatment": String,
#             "notes": String
#         },
#         ...
#     ],
#     "allergies": [
#         {
#             "allergen": String,
#             "reaction": String,
#             "severity": String, # "mild", "moderate", "severe"
#             "notes": String
#         },
#         ...
#     ]
# }

def has_edge_with_name(patient_id, name):
    db = client['hackthe6ix']  # database name
    patients_collection = db['patients']  # collection name
    doc = patients_collection.find_one(
        {"_id": patient_id, "edges.name": name},
        {"_id": 1}  # projection can be minimal, since we only care if it exists
    )
    return doc is not None


def add_patient(patient_data):
    """
    Add a new patient to the database
    
    Args:
        patient_data: Dictionary containing patient information with '_id' as email
        
    Returns:
        The patient's _id (email) that was inserted
    """
    db = client['hackthe6ix'] # database name
    patients_collection = db['patients'] # collection name within the database
    
    # Ensure _id is present and is a string (email)
    if '_id' not in patient_data:
        raise ValueError("Patient data must include '_id' field with email address")
    
    result = patients_collection.insert_one(patient_data)
    
    # Return the actual _id that was used (should be the email)
    return patient_data['_id']

def edit_patient(patient_id, update_operation):
    """
    Update a patient document using MongoDB update operations
    
    Args:
        patient_id: The patient's _id (email)
        update_operation: MongoDB update operation dict (e.g., {"$set": {...}}, {"$push": {...}})
    """
    db = client['hackthe6ix']
    patients_collection = db['patients']
    
    # _id is always the email string
    query = {"_id": patient_id}
    
    result = patients_collection.update_one(query, update_operation)
    return result.modified_count

def get_patient_by_id(patient_id):
    """
    Retrieve a patient by their ID
    
    Args:
        patient_id: The patient's _id (email)
    
    Returns:
        Patient document or None if not found
    """
    db = client['hackthe6ix']
    patients_collection = db['patients']
    
    # _id is always the email string
    query = {"_id": patient_id}
    
    doc = patients_collection.find_one(query)
    return doc

def get_all_patients():
    """
    Retrieve all patients from the database
    
    Returns:
        List of patient documents
    """
    db = client['hackthe6ix']
    patients_collection = db['patients']
    
    docs = list(patients_collection.find())
    return [doc for doc in docs]

def delete_patient(patient_id):
    """
    Delete a patient by their ID
    
    Args:
        patient_id: The patient's _id (email)
    
    Returns:
        Number of deleted documents
    """
    db = client['hackthe6ix']
    patients_collection = db['patients']
    
    # _id is always the email string
    query = {"_id": patient_id}
    
    result = patients_collection.delete_one(query)
    return result.deleted_count

if __name__ == "__main__":
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    
    # Test the add_patient function with proper email _id
    patient_info = {
        "_id": "john.doe@test.com",  # Email as _id
        "name": "John Doe",
        "age": 30,
        "sex": "male",
        "doctor": "Dr. Smith",
        "nodes": [],
        "edges": [],
        "medical_history": [
            {
                "condition": "diabetes",
                "diagnosis_date": "2023-01-15", 
                "treatment": "medication",
                "notes": "well controlled"
            }
        ],
        "allergies": []
    }
    
    try:
        patient_id = add_patient(patient_info)
        print(f"Patient added with ID: {patient_id}")
        
        # Test retrieval
        retrieved_patient = get_patient_by_id(patient_id)
        print(f"Retrieved patient: {retrieved_patient['name'] if retrieved_patient else 'Not found'}")
        
        # Clean up test data
        delete_patient(patient_id)
        print("Test patient deleted")
        
    except Exception as e:
        print(f"Test failed: {e}")

