import React, { useState, useEffect } from 'react';
import { Camera } from '../Camera';

export function AddDrugPage(user) {

  return (
    <div className="app">
      <Camera user={user}/>
    </div>
  );
}