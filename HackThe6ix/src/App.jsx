import React, { useState , useEffect} from 'react';
import DrugInteractionGraph from './Components/DrugInteractionGraph';
import {Camera} from "./Camera.jsx"
import LoginButton from "./Components/LoginButton.jsx"
import logoutButton from "./Components/LogoutButton.jsx"
import LogoutButton from './Components/LogoutButton.jsx';
import { useAuth0 } from '@auth0/auth0-react';
import { postUser, fetchUserByEmail } from './Bridge.js';

function App() {
  const [medications, setMedications] = useState([
    {
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'Every 6 hours',
      category: 'OTC',
      notes: 'Take with food'
    },
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'Metaformin',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'Advil',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'This person taking too many drugs',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'One more',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
  ]);

  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User email:", user.email);
      fetchUserByEmail(user.email);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="app">
      <LoginButton />
      <LogoutButton />
      <h1>Medication Interaction Visualizer</h1>
      <DrugInteractionGraph medications={medications} />
      <Camera />
    </div>
  );
}

export default App;