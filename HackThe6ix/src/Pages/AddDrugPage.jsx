import React, { useState, useEffect } from 'react';
import DrugInteractionGraph from '../Components/DrugInteractionGraph';
import { Camera } from "./Camera.js";

function App() {

  return (
    <div className="app">
      <DrugInteractionGraph />
      <Camera />
    </div>
  );
}

export default App;