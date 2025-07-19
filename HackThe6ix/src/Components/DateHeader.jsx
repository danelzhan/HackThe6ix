import React from 'react';
import { format, addDays } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import '../App.css'

const DateHeader = ({ currentDate, onDateChange, onCalendarToggle }) => {
  return (
    <div className="date-header">
      <button className="date-button" onClick={() => onDateChange(addDays(currentDate, -1))}>
        <FiChevronLeft size={24} />
      </button>
      
      <div className="date-display" onClick={onCalendarToggle}>
        
        <span>{format(currentDate, 'eeee, MMMM d, yyyy')}</span>
      </div>
      
      <button className="date-button" onClick={() => onDateChange(addDays(currentDate, 1))}>
        <FiChevronRight size={24} />
      </button>
    </div>
  );
};

export default DateHeader;