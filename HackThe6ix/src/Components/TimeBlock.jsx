
import { FiCircle, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import '../App.css';

const TimeBlock = ({ time, medications, editMode, onMedicationToggle }) => {

  return (
    <div className="time-block">
      <div className="time-header">
        <span className="time">{time}</span>
        {editMode && (
          <button className="invisi-button" onClick={() =>window.location.href = '/journal/medication-form'}>
            <FiPlus className="add-med" />
          </button>
        )}
      </div>

      <div className="medications-list">
        {medications.map((med) => (
          <div key={med.id || med.name} className="medication-item">
            {!editMode ? (
              <>
                {/*!! TODO: ADD BACKEND */} 
                <button
                  className="check-button"
                  onClick={() => onMedicationToggle(med.name)}
                >
                  {med.taken ? <FiCheck /> : <FiCircle />}
                </button>
                <span>{med.name || med}</span>
              </>
            ) : (
              <>
                {/*!! TODO: ADD BACKEND */} 
                <button
                  className="delete-button"
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
