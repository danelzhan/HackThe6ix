import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css'

const CalendarModal = ({ selectedDate, onSelectDate, onClose }) => {
  return (
    <div className="calendar-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <Calendar
          onChange={onSelectDate}
          value={selectedDate}
        />
      </div>
    </div>
  );
};

export default CalendarModal;