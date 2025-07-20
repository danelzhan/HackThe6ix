import React from 'react';
import DrugInteractionGraph from '../Components/DrugInteractionGraph';
import '../App.css';

export function InteractionsPage() {

  return (
    <div className="app">
      <DrugInteractionGraph />
    </div>
  );
  
}