import React from 'react';
import { FiCircle, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import '../App.css';

const TimeBlock = ({ time, medications, editMode, onMedicationToggle }) => {
  return (
    <div className="time-block">
      <div className="time-header">
        <span className="time">{time}</span>
        {editMode && <FiPlus className="add-med" />}
      </div>
      
      <div className="medications-list">
        {medications.map((med) => (
          <div key={med.id || med.name} className="medication-item">
            {!editMode ? (
              <>
                <button 
                  className="check-button" 
                  // NEEDS CHANGING LATER W BACKEND !!!
                  onClick={() => onMedicationToggle(med.name)}
                >
                  {med.taken ? <FiCheck /> : <FiCircle />}
                </button>
                <span>{med.name || med}</span>
              </>
            ) : (
              <>
                <button 
                  className="delete-button" 
                  // NEEDS CHANGING LATER W BACKEND !!!
                  onClick={() => console.log('Delete', med)}
                >
                  <FiX />
                </button>
                <span>{med.name || med}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;