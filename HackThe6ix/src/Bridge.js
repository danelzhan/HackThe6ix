import { Patient } from './Objects.js';

export async function postUser() {
    fetch('http://localhost:5000/patients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        body: JSON.stringify({
            _id: "john.doe@email.com",
            name: "John Doe",
            age: 30,
            sex: "male",
            doctor: "Dr. Smith",
            nodes: [],
            edges: [],
            medical_history: [],
            allergies: []
        }),
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

export async function fetchUserByEmail(email) {
    const response = await fetch(`http://localhost:5000/patients/${encodeURIComponent(email)}`);
    const data = await response.json();
    console.log(new Patient(data.data))
    return new Patient(data.data);
}

export async function postNode(node, patient_ID) {
    fetch(`http://localhost:5000/patients/add_node/${patient_ID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        body: JSON.stringify(node),
    })
    .then(response => response.json())
    .then(data => console.log(data));
}