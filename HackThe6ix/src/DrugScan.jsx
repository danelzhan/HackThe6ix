import React, { useState } from "react";
import './App.css'
import { main } from './DrugScanParse.js'
import { Camera } from './Camera.jsx'
import { DrugScanForm } from "./DrugScanForm.jsx";

export function DrugScan() {
    const [showForm, setShowForm] = useState(false);
    const [drug, setDrug] = useState(null);

    async function handleClick() {
        const drugData = await main();
        setDrug(drugData);
        setShowForm(true);
    }

    return (
        <>
            <p onClick={handleClick}>Click</p>
            <Camera />
            {showForm && <DrugScanForm drug={drug} />}
        </>
    )
}

