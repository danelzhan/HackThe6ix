import React, { useState } from "react";
import './App.css';

export function DrugScanForm({ drug = {} }) {
    const [formData, setFormData] = useState({
        drug_name: drug.drug_name || "",
        drug_ingredient: drug.drug_ingredient || "",
        din: drug.din || "",
        form: drug.form || "",
        dosage: drug.dosage || "",
        frequency: drug.frequency || "",
        category: drug.category || "",
        start_date: drug.start_date || "",
        end_date: drug.end_date || "",
        notes: drug.notes || "",
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        // You can handle form submission here
        console.log(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="drug-form">
            <label>
                Drug Name:
                <input name="drug_name" value={formData.drug_name} onChange={handleChange} />
            </label>
            <label>
                Ingredient:
                <input name="drug_ingredient" value={formData.drug_ingredient} onChange={handleChange} />
            </label>
            <label>
                DIN:
                <input name="din" value={formData.din} onChange={handleChange} />
            </label>
            <label>
                Form:
                <input name="form" value={formData.form} onChange={handleChange} />
            </label>
            <label>
                Dosage:
                <input name="dosage" value={formData.dosage} onChange={handleChange} />
            </label>
            <label>
                Frequency:
                <input name="frequency" value={formData.frequency} onChange={handleChange} />
            </label>
            <label>
                Category:
                <input name="category" value={formData.category} onChange={handleChange} />
            </label>
            <label>
                Start Date:
                <input name="start_date" type="date" value={formData.start_date} onChange={handleChange} />
            </label>
            <label>
                End Date:
                <input name="end_date" type="date" value={formData.end_date} onChange={handleChange} />
            </label>
            <label>
                Notes:
                <textarea name="notes" value={formData.notes} onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    )

}

