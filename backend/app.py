# Flask app main
from flask import Flask, request, jsonify
from flask_cors import CORS
import database
import gemini
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample data for demonstration
sample_patients = [
    {
        "id": "1",
        "name": "John Doe",
        "age": 30,
        "sex": "male",
        "doctor": "Dr. Smith",
        "current_prescriptions": [
            {
                "drug_name": "Metformin",
                "din": 123456789,
                "dosage": "500mg",
                "frequency": "twice daily",
                "time_taken": "08:00",
                "start_date": "2024-01-15",
                "end_date": "2024-12-15"
            }
        ]
    }
]

@app.route('/', methods=['GET'])
def home():
    """Home endpoint - returns basic API info"""
    return jsonify({
        "message": "HackThe6ix Medical API",
        "version": "1.0",
        "endpoints": {
            "GET /": "API info",
            "GET /patients": "Get all patients",
            "POST /patients": "Add new patient",
            "PUT /patients/<id>": "Update patient",
            "POST /analyze": "Analyze medical data with AI"
        }
    })

@app.route('/patients', methods=['GET'])
def get_patients():
    """GET endpoint - returns all patients as JSON"""
    try:
        return jsonify({
            "success": True,
            "data": sample_patients,
            "count": len(sample_patients)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/patients', methods=['POST'])
def create_patient():
    """POST endpoint - creates a new patient from JSON data"""
    try:
        # Get JSON data from request
        patient_data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'age', 'sex', 'doctor']
        for field in required_fields:
            if field not in patient_data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Add patient to database
        patient_id = add_patient(patient_data)
        
        return jsonify({
            "success": True,
            "message": "Patient created successfully",
            "patient_id": patient_id,
            "data": patient_data
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """PUT endpoint - updates an existing patient"""
    try:
        # Get JSON data from request
        updated_data = request.get_json()
        
        # Update patient in database
        modified_count = edit_patient(patient_id, updated_data)
        
        if modified_count > 0:
            return jsonify({
                "success": True,
                "message": "Patient updated successfully",
                "patient_id": patient_id,
                "modified_count": modified_count
            })
        else:
            return jsonify({
                "success": False,
                "message": "Patient not found or no changes made"
            }), 404
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/analyze', methods=['POST'])
def analyze_data():
    """POST endpoint - analyzes medical data using AI"""
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if 'patient_data' not in data:
            return jsonify({
                "success": False,
                "error": "Missing 'patient_data' field"
            }), 400
        
        patient_data = data['patient_data']
        question = data.get('question', "Analyze this medical data")
        
        # Use Gemini to analyze the data
        analysis = analyze_medical_data(patient_data, question)
        
        return jsonify({
            "success": True,
            "analysis": analysis,
            "question": question
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
