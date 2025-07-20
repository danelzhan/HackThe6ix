import React, { useState } from 'react';
import DateHeader from './DateHeader';
import CalendarModal from './CalendarModal';
import TimeBlock from './TimeBlock';
import EditButton from './EditButton';
import '../App.css';

const MedicationJournal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // SAMPLE DATA !! NEED TO BE REPLACED
  const [journal, setJournal] = useState({
    '08:00': [
      { name: 'Ibuprofen', taken: false },
      { name: 'Lisinopril', taken: false }
    ],
    '12:00': [
      { name: 'Metformin', taken: false }
    ],
    '18:00': [
      { name: 'Ibuprofen', taken: false }
    ]
  });



  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleMedicationToggle = (time, medicationName) => {
    setJournal(prevJournal => {
      const updatedTimeBlock = prevJournal[time].map(med => 
        med.name === medicationName 
          ? { ...med, taken: !med.taken } 
          : med
      );
      
      return {
        ...prevJournal,
        [time]: updatedTimeBlock
      };
    });
  };

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
      
      {Object.entries(journal).map(([time, medications]) => (
        <TimeBlock
          key={time}
          time={time}
          medications={medications}
          editMode={editMode}
          onMedicationToggle={(medName) => handleMedicationToggle(time, medName)}
        />
      ))}
      
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
    </div>
  );
};

export default MedicationJournal;