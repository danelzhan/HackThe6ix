import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DateHeader from './DateHeader';
import CalendarModal from './CalendarModal';
import TimeBlock from './TimeBlock';
import EditButton from './EditButton';
import DrugPopup from './DrugPopup';
import { useFetchCurrentUser } from '../Bridge.js';
import '../App.css';
import { FiCircle, FiCheck, FiX, FiPlus } from 'react-icons/fi';
const MedicationJournal = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [journal, setJournal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drugs, setDrugs] = useState([]);
  const [drugPopup, setDrugPopup] = useState({ visible: false, drug: null });
  const { fetchCurrentUser, userEmail, isAuthenticated } = useFetchCurrentUser();

  // Fetch patient data and organize drugs
  useEffect(() => {
    const fetchPatientData = async () => {
      if (isAuthenticated && userEmail) {
        try {
          setLoading(true);
          const patient = await fetchCurrentUser();
          
          if (patient && patient.nodes) {
            // Filter only drug nodes (nodes with din)
            const drugNodes = patient.nodes.filter(node => node.din);
            setDrugs(drugNodes);
            
            // Organize drugs by time/frequency
            const organizedMedications = organizeDrugsByTime(drugNodes);
            setJournal(organizedMedications);
          }
        } catch (error) {
          console.error('Error fetching patient data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [isAuthenticated, userEmail]);

  const organizeDrugsByTime = (drugNodes) => {
    const allMedications = [];
    
    drugNodes.forEach(drug => {
      // Use the time_taken field directly, or default to 08:00 if not specified
      const time = drug.time_taken || '08:00';
      
      allMedications.push({
        ...drug,
        taken: false, // Default to not taken
        time: time
      });
    });
    
    // Sort by time (HH:MM format)
    return allMedications.sort((a, b) => a.time.localeCompare(b.time));
  };

  // Same color logic as GraphNode.jsx
  const getMedicationColor = (medication) => {
    if (medication.din) {
      // cardiovascular, antibiotic, mental, hormonal, pain, GI, OTC
      if (medication.category === 'cardiovascular') {
        return '#7B89FF';
      }
      if (medication.category === 'antibiotic') {
        return '#FFB8B8';
      }
      if (medication.category === 'mental') {
        return '#B3FEA9';
      }
      if (medication.category === 'hormonal') {
        return '#BAA9FE';
      }
      if (medication.category === 'pain') {
        return '#FED5A9';
      }
      if (medication.category === 'gi') {
        return '#FFFBB8';
      }
      if (medication.category === 'otc') {
        return '#c5c5c5ff';
      }
      return '#C5B6F1'; // Default purple for drugs
    } else {
      return '#D1FFB8'; // Green for food
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleMedicationToggle = (medicationIndex) => {
    setJournal(prevJournal => {
      const updatedJournal = [...prevJournal];
      updatedJournal[medicationIndex] = {
        ...updatedJournal[medicationIndex],
        taken: !updatedJournal[medicationIndex].taken
      };
      return updatedJournal;
    });
  };

  const handleDrugClick = (drugNode) => {
    setDrugPopup({ visible: true, drug: drugNode });
  };

  const handleCloseDrugPopup = () => {
    setDrugPopup({ visible: false, drug: null });
  };

  if (loading) {
    return (
      <div className="journal-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          color: '#666'
        }}>
          Loading medication journal...
        </div>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <DateHeader 
        currentDate={currentDate} 
        onDateChange={handleDateChange}
        onCalendarToggle={() => setShowCalendar(true)}
      />
      
      <EditButton 
        editMode={editMode} 
        onToggle={toggleEditMode} 
      />
      
      {journal.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          No medications found. Add some medications to get started.
        </div>
      ) : (
        journal.map((medication, index) => (
          <EnhancedMedicationCard
            key={`${medication.din}-${medication.time}-${index}`}
            medication={medication}
            editMode={editMode}
            onMedicationToggle={() => handleMedicationToggle(index)}
            onDrugClick={handleDrugClick}
            getMedicationColor={getMedicationColor}
          />
        ))
      )}
      
      {showCalendar && (
        <CalendarModal
          selectedDate={currentDate}
          onSelectDate={(date) => {
            handleDateChange(date);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}

      <div className="time-block">
        <button className="time-block-button" onClick={() => navigate('/journal/medication-form')}>
            <FiPlus className="add-med" />
        </button>
      </div>

      {/* Drug Popup */}
      <DrugPopup
        drugNode={drugPopup.drug}
        isVisible={drugPopup.visible}
        onClose={handleCloseDrugPopup}
      />
    </div>
  );
};

// Enhanced Medication Card component - displays individual medication with time
const EnhancedMedicationCard = ({ medication, onMedicationToggle, editMode, onDrugClick, getMedicationColor }) => {
  const timeInMinutes = parseInt(medication.time.split(':')[0]) * 60 + parseInt(medication.time.split(':')[1]);
  const isCurrentTime = Math.abs(timeInMinutes - (new Date().getHours() * 60 + new Date().getMinutes())) < 30;
  const medicationColor = getMedicationColor(medication);

  const handleCardClick = () => {
    if (medication.din) {
      onDrugClick(medication);
    }
  };

  return (
    <div style={{
      marginBottom: '16px',
      padding: '16px',
      backgroundColor: medicationColor,
      borderRadius: '12px',
      border: `2px solid ${medication.taken ? '#4ade80' : (isCurrentTime ? '#8b5cf6' : 'transparent')}`,
      boxShadow: isCurrentTime ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onClick={handleCardClick}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Time Display */}
        <div style={{
          backgroundColor: isCurrentTime ? '#8b5cf6' : 'rgba(0, 0, 0, 0.1)',
          color: isCurrentTime ? 'white' : '#374151',
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          minWidth: '70px',
          textAlign: 'center'
        }}>
          {medication.time}
          {isCurrentTime && (
            <div style={{
              fontSize: '10px',
              marginTop: '2px',
              opacity: 0.9
            }}>
              NOW
            </div>
          )}
        </div>
        
        {/* Medication Info */}
        <div style={{ flex: 1, marginLeft: '16px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '4px'
          }}>
            {medication.drug_name}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#555',
            marginBottom: '4px'
          }}>
            {medication.dosage} • {medication.frequency}
          </div>
          {medication.category && (
            <div style={{
              fontSize: '12px',
              color: '#666',
              fontStyle: 'italic',
              textTransform: 'capitalize'
            }}>
              {medication.category}
            </div>
          )}
        </div>
        
        {/* Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {medication.taken && (
            <div style={{
              backgroundColor: '#4ade80',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              TAKEN
            </div>
          )}
          
          {editMode && (
            <input
              type="checkbox"
              checked={medication.taken || false}
              onChange={onMedicationToggle}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '20px',
                height: '20px',
                accentColor: '#8b5cf6'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationJournal;