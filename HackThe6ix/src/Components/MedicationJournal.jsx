import React, { useState, useEffect } from 'react';
import DateHeader from './DateHeader';
import CalendarModal from './CalendarModal';
import TimeBlock from './TimeBlock';
import EditButton from './EditButton';
import { useFetchCurrentUser } from '../Bridge.js';
import '../App.css';
import { FiCircle, FiCheck, FiX, FiPlus } from 'react-icons/fi';
const MedicationJournal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [journal, setJournal] = useState({});
  const [loading, setLoading] = useState(true);
  const [drugs, setDrugs] = useState([]);
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
            const organizedJournal = organizeDrugsByTime(drugNodes);
            setJournal(organizedJournal);
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
    const timeSlots = {};
    
    drugNodes.forEach(drug => {
      // Parse frequency to determine time slots
      const times = parseFrequencyToTimes(drug.frequency);
      
      times.forEach(time => {
        if (!timeSlots[time]) {
          timeSlots[time] = [];
        }
        timeSlots[time].push({
          ...drug,
          taken: false, // Default to not taken
          time: time
        });
      });
    });
    
    return timeSlots;
  };

  const parseFrequencyToTimes = (frequency) => {
    if (!frequency) return ['08:00']; // Default time if no frequency specified
    
    const freq = frequency.toLowerCase();
    
    // Parse common frequency patterns
    if (freq.includes('once') || freq.includes('1x') || freq.includes('daily')) {
      return ['08:00'];
    } else if (freq.includes('twice') || freq.includes('2x') || freq.includes('bid')) {
      return ['08:00', '20:00'];
    } else if (freq.includes('three') || freq.includes('3x') || freq.includes('tid')) {
      return ['08:00', '14:00', '20:00'];
    } else if (freq.includes('four') || freq.includes('4x') || freq.includes('qid')) {
      return ['08:00', '12:00', '16:00', '20:00'];
    } else if (freq.includes('morning')) {
      return ['08:00'];
    } else if (freq.includes('evening') || freq.includes('night')) {
      return ['20:00'];
    } else if (freq.includes('noon') || freq.includes('lunch')) {
      return ['12:00'];
    } else {
      // Try to extract specific times if mentioned
      const timeMatches = freq.match(/\d{1,2}:\d{2}/g);
      if (timeMatches && timeMatches.length > 0) {
        return timeMatches;
      }
      return ['08:00']; // Default fallback
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleMedicationToggle = (time, medicationDin) => {
    setJournal(prevJournal => {
      const updatedTimeBlock = prevJournal[time].map(med => 
        med.din === medicationDin 
          ? { ...med, taken: !med.taken } 
          : med
      );
      
      return {
        ...prevJournal,
        [time]: updatedTimeBlock
      };
    });
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
      
      {Object.keys(journal).length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          No medications found. Add some medications to get started.
        </div>
      ) : (
        Object.entries(journal)
          .sort(([timeA], [timeB]) => timeA.localeCompare(timeB))
          .map(([time, medications]) => (
            <EnhancedTimeBlock
              key={time}
              time={time}
              medications={medications}
              editMode={editMode}
              onMedicationToggle={(medDin) => handleMedicationToggle(time, medDin)}
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
        <button className="time-block-button" onClick={() =>window.location.href = '/journal/medication-form'}>
            <FiPlus className="add-med" />
        </button>
      </div>
    </div>
  );
};

// Enhanced TimeBlock component with better styling
const EnhancedTimeBlock = ({ time, medications, onMedicationToggle, editMode }) => {
  const timeInMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  const isCurrentTime = Math.abs(timeInMinutes - (new Date().getHours() * 60 + new Date().getMinutes())) < 30;

  return (
    <div style={{
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: isCurrentTime ? '#f0f8ff' : '#fafafa',
      borderRadius: '12px',
      border: isCurrentTime ? '2px solid #C5B6F1' : '1px solid #e0e0e0',
      boxShadow: isCurrentTime ? '0 4px 12px rgba(197, 182, 241, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: isCurrentTime ? '#7c3aed' : '#333',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {time}
        {isCurrentTime && (
          <span style={{
            marginLeft: '8px',
            fontSize: '12px',
            background: '#C5B6F1',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            Current
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gap: '8px' }}>
        {medications.map((med, index) => (
          <DrugPanel 
            key={index}
            medication={med}
            onToggle={() => onMedicationToggle(time, med.din)}
            editMode={editMode}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Drug Panel component
const DrugPanel = ({ medication, onToggle, editMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div style={{
      backgroundColor: 'white',
      border: `2px solid ${medication.taken ? '#4ade80' : '#C5B6F1'}`,
      borderRadius: '8px',
      padding: '12px',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onClick={() => setIsExpanded(!isExpanded)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '4px'
          }}>
            {medication.drug_name}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '4px'
          }}>
            {medication.dosage} • {medication.frequency}
          </div>
          {medication.instructions && (
            <div style={{
              fontSize: '12px',
              color: '#888',
              fontStyle: 'italic'
            }}>
              {medication.instructions}
            </div>
          )}
        </div>
        
        {editMode && (
          <div style={{ marginLeft: '12px' }}>
            <input
              type="checkbox"
              checked={medication.taken || false}
              onChange={onToggle}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '20px',
                height: '20px',
                accentColor: '#C5B6F1'
              }}
            />
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#555'
        }}>
          <div><strong>DIN:</strong> {medication.din}</div>
          <div><strong>Strength:</strong> {medication.strength || 'Not specified'}</div>
          <div><strong>Route:</strong> {medication.route || 'Oral'}</div>
          {medication.side_effects && (
            <div><strong>Common Side Effects:</strong> {medication.side_effects}</div>
          )}
          {medication.food_instructions && (
            <div><strong>Food Instructions:</strong> {medication.food_instructions}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationJournal;