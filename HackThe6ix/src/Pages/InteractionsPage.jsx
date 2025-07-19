import React from 'react';
import DrugInteractionGraph from '../Components/DrugInteractionGraph';

export function InteractionsPage() {

  return (
    <div className="app">
        <DrugInteractionGraph patientEmail="john.doe@email.com" />
    </div>
  );
}