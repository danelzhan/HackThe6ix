swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/apidocs/"
}

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "HackThe6ix Medical API",
        "description": "A medical patient management and drug interaction analysis API",
        "contact": {
            "responsibleOrganization": "HackThe6ix Team",
            "responsibleDeveloper": "Medical Team",
            "email": "team@hackthe6ix.com",
            "url": "https://hackthe6ix.com",
        },
        "termsOfService": "http://hackthe6ix.com/terms",
        "version": "1.0"
    },
    "host": "localhost:5000",  # overrides localhost:500
    "basePath": "/",  # base bash for blueprint registration
    "schemes": [
        "http",
        "https"
    ],
    "operationId": "getmyData"
}

sample_patients = [
    {
        "_id": "john.doe@email.com",
        "name": "John Doe",
        "age": 30,
        "sex": "male",
        "doctor": "Dr. Smith",
        "nodes": [
            {
                "drug_name": "Metformin",
                "din": "12345678",
                "dosage": "500mg",
                "frequency": "twice daily",
                "category": "Prescription",
                "time_taken": "08:00",
                "start_date": "2024-01-15",
                "end_date": "2024-12-15",
                "notes": "Take with food"
            }
        ],
        "edges": [],
        "medical_history": [
            {
                "condition": "Type 2 Diabetes",
                "diagnosis_date": "2023-06-01",
                "treatment": "Medication and diet control",
                "notes": "Well controlled"
            }
        ],
        "allergies": [
            {
                "allergen": "Penicillin",
                "reaction": "Rash",
                "severity": "moderate",
                "notes": "Avoid all penicillin-based antibiotics"
            }
        ]
    },
    {
        "_id": "john.doe@email.com",
        "name": "oiia cat",
        "age": 30,
        "sex": "male",
        "doctor": "Dr. Smith",
        "nodes": [
            {
                "drug_name": "Metformin",
                "din": 123456789,
                "dosage": "500mg",
                "frequency": "twice daily",
                "category": "Prescription",
                "time_taken": "08:00",
                "start_date": "2024-01-15",
                "end_date": "2024-12-15",
                "notes": "Take with food"
            },
            {
                "name": "apples"
            },
            {
                "name": "marijuana"
            },
            {
                "name": "alcohol"
            }
        ],
        "edges": [],
        "medical_history": [
            {
                "condition": "Type 2 Diabetes",
                "diagnosis_date": "2023-06-01",
                "treatment": "Medication and diet control",
                "notes": "Well controlled"
            }
        ],
        "allergies": [
            {
                "allergen": "Penicillin",
                "reaction": "Rash",
                "severity": "moderate",
                "notes": "Avoid all penicillin-based antibiotics"
            }
        ]
    }
]

sample_nodes = [
    {
                "drug_name": "Acetaminophen",
                "din": 12345678,
                "dosage": "50mg",
                "frequency": "twice daily",
                "category": "Prescription",
                "time_taken": "08:00",
                "start_date": "2024-01-15",
                "end_date": "2024-12-15",
                "notes": "Take with food"
    }
]