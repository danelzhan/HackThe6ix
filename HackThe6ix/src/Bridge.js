import { Patient } from './Objects.js';
import { useAuth0 } from '@auth0/auth0-react';

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

// Hook for fetching the current authenticated user automatically
export function useFetchCurrentUser() {
    const { user, isAuthenticated } = useAuth0();
    
    const fetchCurrentUser = async () => {
        if (!isAuthenticated || !user?.email) {
            throw new Error('User not authenticated or email not available');
        }
        
        const response = await fetch(`${BRIDGE_URL}/patients/${encodeURIComponent(user.email)}`);
        const data = await response.json();
        console.log(new Patient(data.data));
        return new Patient(data.data);
    };
    
    return { fetchCurrentUser, userEmail: user?.email, isAuthenticated };
}

// Standalone function for fetching current user without hook (for use in non-component contexts)
export async function fetchCurrentUser() {
    // This function can be used in contexts where hooks aren't available
    // but requires the Auth0 context to be available higher up in the component tree
    throw new Error('Use useFetchCurrentUser hook in React components or fetchUserByEmail with specific email');
}

export async function postNode(node, patient_ID) {
    try {
        const response = await fetch(`${BRIDGE_URL}/patients/add_node/${patient_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(node),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Successfully added node:', data);
        return data;
    } catch (error) {
        console.error('Error in postNode:', error);
        throw error; // Re-throw so calling code can catch it
    }
}