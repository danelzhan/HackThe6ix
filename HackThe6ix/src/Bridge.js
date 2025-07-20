import { Patient } from './Objects.js';

const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL || 'http://localhost:5000';

export async function postUser(user) {
    fetch(`${BRIDGE_URL}/patients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        body: user,
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

export async function fetchUserByEmail(email) {
    const response = await fetch(`${BRIDGE_URL}/patients/${encodeURIComponent(email)}`);
    const data = await response.json();
    console.log(new Patient(data.data))
    return new Patient(data.data);
}

export async function postNode(node, patient_ID) {
    fetch(`${BRIDGE_URL}/patients/add_node/${patient_ID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
    },
        body: JSON.stringify(node),
    })
    .then(response => response.json())
    .then(data => console.log(data));
}