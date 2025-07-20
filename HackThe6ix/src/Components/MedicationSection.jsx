import React from 'react';

export function MedicationSection({user}) {

    const medication = user.user.nodes
  
    return <div className="medication_section">

        {medication.map((med, idx) => (
            <div key={idx} className="medication_item">
            <p><strong>Drug Name:</strong> {med.drug_name}</p>
            <p><strong>DIN:</strong> {med.din}</p>
            <p><strong>Dosage:</strong> {med.dosage}</p>
            {/* add more fields as needed */}
            </div>
        ))}

    </div>

}