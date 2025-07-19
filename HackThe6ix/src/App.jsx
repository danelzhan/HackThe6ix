import React, { useState } from 'react';
import DrugInteractionGraph from './Components/DrugInteractionGraph';

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
    // Add more 
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

  return (
    <div className="app">
      <h1>Medication Interaction Visualizer</h1>
      <DrugInteractionGraph medications={medications} />
    </div>
  );
}

export default App;