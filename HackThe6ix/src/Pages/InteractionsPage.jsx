import React from 'react';
import DrugInteractionGraph from '../Components/DrugInteractionGraph';
import '../App.css';

export function InteractionsPage() {

  return (
    <div className="app">
      <div className="gradient-header">
        <h1>Drug Interactions</h1>
        <p>Monitor your medication interactions and safety</p>
      </div>
      <DrugInteractionGraph />
    </div>
  );
  
}