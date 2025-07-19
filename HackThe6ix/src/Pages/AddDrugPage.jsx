import React, { useState, useEffect } from 'react';
import { Camera } from "./Camera.js";

function App() {

  return (
    <div className="app">
      <DrugInteractionGraph medications={medications} />
      <Camera />
      {userObj && <div>User: {userObj.name}</div>}
    </div>
  );
}

export default App;