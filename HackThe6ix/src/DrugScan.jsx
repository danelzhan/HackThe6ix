import React, { useState } from "react";
import './App.css'
import { main } from './DrugScanParse.js'
import { Camera } from './Camera.jsx'

export function DrugScan() {
    const [image, setImage] = useState("");
  
    return <>
        <p onClick={() => main(image)}>Click</p>
        <Camera setImage = {setImage} />
    </>

}

