# Flask app main
from flask import Flask, request, jsonify
from flask_cors import CORS
import database
import gemini
import json
from flasgger import Swagger
import logging
import random_assets

logging.basicConfig(level=logging.INFO)
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
Swagger(app, config=random_assets.swagger_config, template=random_assets.swagger_template)
# Swagger configuration

@app.route('/', methods=['GET'])
def home():
    """Home endpoint - returns basic API info
    ---
    tags:
      - General
    responses:
      200:
        description: API information
        schema:
          type: object
          properties:
            message:
              type: string
            version:
              type: string
            endpoints:
              type: object
    """
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
    """GET endpoint - returns all patients as JSON
    ---
    tags:
      - Patients
    responses:
      200:
        description: List of all patients
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: array
              items:
                type: object
            count:
              type: integer
      500:
        description: Server error
        schema:
          type: object
          properties:
            success:
              type: boolean
            error:
              type: string
    """
    try:
        # Get all patients from database
        all_patients = database.get_all_patients()
        
        return jsonify({
            "success": True,
            "data": all_patients,
            "count": len(all_patients)
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/patients', methods=['POST'])
def create_patient():
    """POST endpoint - creates a new patient from JSON data
    ---
    tags:
      - Patients
    parameters:
      - name: patient_data
        in: body
        required: true
        schema:
          type: object
          properties:
            _id:
              type: string
              description: Patient's email address
              example: "john.doe@email.com"
            name:
              type: string
              example: "John Doe"
            age:
              type: integer
              example: 30
            sex:
              type: string
              enum: ["male", "female"]
              example: "male"
            doctor:
              type: string
              example: "Dr. Smith"
            nodes:
              type: array
              items:
                type: object
              example: []
            edges:
              type: array
              items:
                type: object
              example: []
            medical_history:
              type: array
              items:
                type: object
              example: []
            allergies:
              type: array
              items:
                type: object
              example: []
          required:
            - _id
            - name
            - age
            - sex
            - doctor
            - nodes
            - edges
            - medical_history
            - allergies
    responses:
      201:
        description: Patient created successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            patient_id:
              type: string
            data:
              type: object
      400:
        description: Missing required field
        schema:
          type: object
          properties:
            success:
              type: boolean
            error:
              type: string
      500:
        description: Server error
    """
    try:
        # Get JSON data from request
        patient_data = request.get_json()
        
        # Validate required fields
        required_fields = ['_id', 'name', 'age', 'sex', 'doctor', 'nodes', 'edges', 'medical_history', 'allergies']
        for field in required_fields:
            if field not in patient_data:
                return jsonify({
                    "success": False,
                    "error": f"Missing required field: {field}"
                }), 400
        
        # Add patient to database
        patient_id = database.add_patient(patient_data)
        
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

@app.route('/patients/add_node/<patient_id>', methods=['POST'])
def add_patient_node(patient_id):
    """POST endpoint - adds a drug node to an existing patient
    ---
    tags:
      - Patients
    parameters:
      - name: patient_id
        in: path
        type: string
        required: true
        description: Patient's email address
        example: "john.doe@email.com"
      - name: node_data
        in: body
        required: true
        schema:
          type: object
          properties:
            node:
              type: object
              properties:
                drug_name:
                  type: string
                  example: "Aspirin"
                din:
                  type: integer
                  example: 123456789
                dosage:
                  type: string
                  example: "100mg"
                frequency:
                  type: string
                  example: "once daily"
                category:
                  type: string
                  example: "OTC"
                time_taken:
                  type: string
                  example: "08:00"
                start_date:
                  type: string
                  example: "2024-01-15"
                end_date:
                  type: string
                  example: "2024-12-15"
                notes:
                  type: string
                  example: "Take with food"
              required:
                - drug_name
                - din
                - dosage
                - frequency
                - category
                - time_taken
                - start_date
                - end_date
                - notes
          required:
            - node
    responses:
      200:
        description: Node added successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            patient_id:
              type: string
            modified_count:
              type: integer
            interactions_added:
              type: integer
      400:
        description: Missing required data
      404:
        description: Patient not found
      500:
        description: Server error
    """
    try:
        # Get JSON data of node item
        data = request.get_json()
        node = data.get('node')
        logging.info(f"Adding node: {node} to patient: {patient_id}")
        if not patient_id or not node:
            return jsonify({
                "success": False,
                "error": "Missing patient_id or node data"
            }), 400
        
        # Get current patient data
        patient_data = database.get_patient_by_id(patient_id)
        if not patient_data:
            return jsonify({
                "success": False,
                "error": "Patient not found"
            }), 404
        logging.info(f"Current patient data: {patient_data}")


        # Get interactions of the new node with existing drugs and foods
        foods = gemini.get_food_interactions(
            drug_name1=node['drug_name'],
            din1=node['din'],
            patient_data=patient_data
        )
        current_foods = []
        for _node in patient_data['nodes']:
            if 'din' in _node:
                continue
            current_foods.append(_node.get('name'))

        for food in foods:
            if(food['name'] not in current_foods):
                database.edit_patient(patient_id, {"$push": {"nodes": {"name": food['name']}}})
            database.edit_patient(patient_id, {"$push": {"edges": food}})

        interactions = gemini.get_all_interactions(node, patient_data)
        logging.info(f"Found {len(interactions)} interactions for new node")
        # Update interactions using proper MongoDB operations
        if interactions:
            # Use $push with $each to add multiple interactions
            database.edit_patient(patient_id, {"$push": {"edges": {"$each": interactions}}})
        
        # Add node to patient using $push operation
        modified_count = database.edit_patient(patient_id, {"$push": {"nodes": node}})
        
        if modified_count > 0:
            return jsonify({
                "success": True,
                "message": "Node added successfully",
                "patient_id": patient_id,
                "modified_count": modified_count,
                "interactions_added": len(interactions) if interactions else 0
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

@app.route('/patients/<patient_id>', methods=['PUT']) # Patient id is the email
def update_patient(patient_id):
    """PUT endpoint - updates patient metadata (not nodes or edges)
    ---
    tags:
      - Patients
    parameters:
      - name: patient_id
        in: path
        type: string
        required: true
        description: Patient's email address
        example: "john.doe@email.com"
      - name: updated_data
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              example: "John Smith"
            age:
              type: integer
              example: 31
            sex:
              type: string
              enum: ["male", "female"]
            doctor:
              type: string
              example: "Dr. Johnson"
            medical_history:
              type: array
              items:
                type: object
            allergies:
              type: array
              items:
                type: object
          description: Fields to update (only metadata, not nodes/edges)
    responses:
      200:
        description: Patient updated successfully
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
            patient_id:
              type: string
            modified_count:
              type: integer
      404:
        description: Patient not found
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
      500:
        description: Server error
    """
    try:
        # Get JSON data from request
        updated_data = request.get_json()
        
        # Update patient using $set operation
        modified_count = database.edit_patient(patient_id, {"$set": updated_data})
        
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

@app.route('/patients/<patient_id>', methods=['GET']) # Get a patient by ID
def get_patient(patient_id):
    """GET endpoint - returns a single patient by ID
    ---
    tags:
      - Patients
    parameters:
      - name: patient_id
        in: path
        type: string
        required: true
        description: Patient's email address
        example: "john.doe@email.com"
    responses:
      200:
        description: Patient found
        schema:
          type: object
          properties:
            success:
              type: boolean
            data:
              type: object
              description: Patient data
            patient_id:
              type: string
      404:
        description: Patient not found
        schema:
          type: object
          properties:
            success:
              type: boolean
            message:
              type: string
      500:
        description: Server error
        schema:
          type: object
          properties:
            success:
              type: boolean
            error:
              type: string
    """
    try:
        # Get patient by ID from database
        patient_data = database.get_patient_by_id(patient_id)
        
        if patient_data:
            return jsonify({
                "success": True,
                "data": patient_data,
                "patient_id": patient_id
            })
        else:
            return jsonify({
                "success": False,
                "message": "Patient not found"
            }), 404
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/patients/remove_node/<patient_id>', methods=['POST'])
def remove_patient_node(patient_id):
    try:
        # Get JSON data of node item
        data = request.get_json()
        din = data.get('din')  # Assuming node is identified by its DIN
        logging.info(f"Removing node: {din} from patient: {patient_id} and removing related interactions")
        if not patient_id or not din:
            return jsonify({
                "success": False,
                "error": "Missing patient_id or node data"
            }), 400
        
        edges_modified = database.edit_patient(patient_id, {"$pull": {"edges": {"din1": din}}}) # 2 cases: din1 or din2
        edges_modified = database.edit_patient(patient_id, {"$pull": {"edges": {"din2": din}}})

        nodes_modified = database.edit_patient(patient_id, {"$pull": {"nodes": {"din": din}}}) # should always only be either 0 or 1...
        
        if edges_modified > 0 and nodes_modified == 0:
            return jsonify({
                "success": False,
                "message": "Edges removed but node not found, how could this happen?",
            })
# else:
        if nodes_modified == 0 and edges_modified == 0:
            return jsonify({
                "success": False,
                "message": "Patient not found or no changes made"
            }), 404
        else:
            return jsonify({
                "success": True,
                "message": "Nodes and/or edges removed successfully",
                "patient_id": patient_id,
                "nodes_deleted": nodes_modified,
                "edges_deleted": edges_modified,
            })
            
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
