import React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from '../Components/WelcomeHeader';
import { FiChevronRight} from 'react-icons/fi';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <div className="component-container">
        {/* !! TODO: BACKEND ADD*/ }
        <WelcomeHeader name="User" />
      </div>

      <div className="journal-snippet">
        
        <button className="journal-snippet-button" onClick={() => navigate('/journal')}>
        <FiChevronRight  size={24} />
        </button><h3 className="journal-title">Journal</h3>
      </div>



{/* 
      <div className="active-snippet">
        <h3 className="journal-title">Active Usage Considerations</h3>


      </div> */}

      {/* <div className="refills-snippet">
        <h3 className="journal-title">Upcoming Refills</h3>


      </div> */}
    </div>
  );
}