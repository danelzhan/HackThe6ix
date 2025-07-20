import React from 'react';

export function MedicationSection(user) {

    const medication = user.nodes
    console.log(user)
  
    return <div className="medication_section">

        {medication.map((med, idx) => (
            <div key={idx} className="medication_item">
            <p><strong>Drug Name:</strong> {med.drug_name}</p>
            <p><strong>DIN:</strong> {med.din}</p>
            <p><strong>Dosage:</strong> {med.dosage}</p>
            </div>
        ))}

    </div>

}