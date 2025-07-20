# HackThe6ix

# Stick these into a backend/.env :
MONGO_USER
MONGO_PASSWORD
GEMINI_API_KEY

# Documentation for JSON objects
Patient structure:
{
    "_id": String, # USE THE EMAIL token from Auth0 !!! to be able to fetch user info
                   # The _id is special to mongodb storage in that it is the token used to search for the right json object
    "name": String,
    "age": Number,
    "sex": String, # "male" or "female"
    "doctor": String, # name of the doctor
    "nodes": [ # List of BOTH prescribed drugs and foods or other substances.
        {
            "drug_name": String, # Example drug entry
            "din": String, # Drug Identification Number
            "dosage": String,
            "frequency": String,
            "category": String,
            "ingredient": String,
            "time_taken": String, # format: "HH:MM" (24-hour format)
            "start_date": String, # format: "YYYY-MM-DD"
            "end_date": String, # format: "YYYY-MM-DD"
            "notes": String
        }, 
        {
            "name": String, # Alcohol, a food, or maybe even recreational drugs may cause harmful interactions.
        },
        ...
    ],
    "edges": [ # list of drug interactions
        { # Example edge between a drug and another drug
            "din1": String, # Drug Identification Number of the first drug
            "din2": String, # Drug Identification Number of the second drug
            "drug_name1": String, # Name of the first drug
            "drug_name2": String, # Name of the second drug
            "interaction_type": String, # Type of interaction (Example: Delayed absorption, Increased side effects, prolongation or bleeding)
            "severity": String, # Severity of the interaction ("mild", "moderate", "severe")
            "advanced_info": String, # Additional information description about the interaction
            "research_links": [ # List of links to research papers or articles about the interaction
                "https://example.com/research1",
                "https://example.com/research2"
            ]
        },
        { # Example edge between a drug and a food
            "din1": # Name of drug
            "name": # Name of the FOOD or OTHER substance.
            "interaction_type":
            "severity":
            "advanced_info": String, # Additional information description about the interaction
            "research_links": [ # List of links to research papers or articles about the interaction
                "https://example.com/research1",
                "https://example.com/research2"
            ]
        }
        ...
    ],
    "medical_history": [
        {
            "condition": String,
            "diagnosis_date": String, # format: "YYYY-MM-DD"
            "treatment": String,
            "notes": String
        },
        ...
    ],
    "allergies": [
        {
            "allergen": String,
            "reaction": String,
            "severity": String, # "mild", "moderate", "severe"
            "notes": String
        },
        ...
    ]
}

# Some valid test nodes:
{
                "drug_name": "Metformin",
                "din": "02242974",
                "dosage": "500mg",
                "frequency": "twice daily",
                "category": "Prescription",
                "time_taken": "08:00",
                "start_date": "2024-01-15",
                "end_date": "2024-12-15",
                "notes": "Take with food"
            }
{
                "drug_name": "Aspirin",
                "din": "02237726",
                "dosage": "81",
                "frequency": "once daily",
                "category": "Prescription",
                "time_taken": "08:00",
                "start_date": "2024-01-15",
                "end_date": "2024-12-15",
                "notes": "Take with food"
            }