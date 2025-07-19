# db.py
import os
from bson.objectid import ObjectId
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
load_dotenv()  # loads from .env automatically


MONGO_USER = os.getenv('MONGO_USER', '')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD', '')

uri = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@cluster0.1iw4ni6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


# DOCUMENTATION ----------- for passed objects for api endpts
# Patient structure:
# {
#     "_id": ObjectId,
#     "name": String,
#     "age": Number,
#     "sex": String, # "male" or "female"
#     "doctor": String, # name of the doctor
#     "nodes": [ # List of prescribed drugs
#         {
#             "drug_name": String, # Example drug entry
#             "din": Int, # Drug Identification Number
#             "dosage": String,
#             "frequency": String,
#             "time_taken": String, # format: "HH:MM" (24-hour format)
#             "start_date": String, # format: "YYYY-MM-DD"
#             "end_date": String # format: "YYYY-MM-DD"
#         },
#         ...
#     ],
#     "edges": [ # list of drug interactions
#         {
#             "din1": Int, # Drug Identification Number of the first drug
#             "din2": Int, # Drug Identification Number of the second drug
#             "interaction_type": String, # Type of interaction (e.g., "antagonistic", "synergistic")
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


def add_patient(patient_data):
    db = client['hackthe6ix'] # database name
    patients_collection = db['patients'] # collection name within the database
    result = patients_collection.insert_one(patient_data)
    return str(result.inserted_id)

def edit_patient(patient_id, updated_data):
    db = client['hackthe6ix']
    patients_collection = db['patients']
    result = patients_collection.update_one(
        {"_id": ObjectId(patient_id)},
        {"$set": updated_data}
    )
    return result.modified_count

if __name__ == "__main__":
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    # Test the add_patient function
    patient_info = {
        "name": "John Doe",
        "age": 30,
        "condition": "diabetes",
        "doctor": "Dr. Smith"
    }
    patient_id = add_patient(patient_info)
    print(f"Patient added with ID: {patient_id}")

