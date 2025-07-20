import React, { useState, useEffect } from 'react';
import { Camera } from '../Camera';

export function AddDrugPage(user) {
  console.log("drugpage", user)

  return (
    <div className="app">
      <Camera user={user}/>
    </div>
  );
}