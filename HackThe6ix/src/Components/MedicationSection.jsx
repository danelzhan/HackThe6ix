import React from 'react';

export function MedicationSection({ user = {} }) {  // Destructure props with default empty object
    // Safely get medications with fallback to empty array
    const medications = user?.nodes || [];
    
    console.log('Current user data:', user);  // Debugging log

    return (
        <div className="medication_section">
            {medications.length > 0 ? (
                medications.map((med, idx) => (
                    <div key={med.din || idx} className="medication_item">  // Prefer DIN as key if available
                        <p><strong>Drug Name:</strong> {med.drug_name || 'Not specified'}</p>
                        <p><strong>DIN:</strong> {med.din || 'N/A'}</p>
                        <p><strong>Dosage:</strong> {med.dosage || 'Not specified'}</p>
                    </div>
                ))
            ) : (
                <p className="no-medications">No medications found</p>
            )}
        </div>
    );
}