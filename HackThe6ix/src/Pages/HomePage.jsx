import React from 'react';
import WelcomeHeader from '../Components/WelcomeHeader';
import { FiChevronRight} from 'react-icons/fi';

export function HomePage() {

  return (
    <div className="app">
      <div className="component-container">
        {/* !! TODO: BACKEND ADD*/ }
        <WelcomeHeader name="" />
      </div>

      <div className="journal-snippet">
        <div className="journal-snippet-header">
          <h3 className="journal-title"> 💊 Journal</h3>
          <button className="journal-snippet-button" onClick={() => window.location.href = '/journal'}>
            <FiChevronRight  size={24} />
          </button>
        </div>

        <div className="time-block component-container">
          <p className="journal-text">Track your medication usage and schedule.</p>
          <br />
          <p className="journal-text">View your medication history.</p>
          <br />
          <p className="journal-text">Add new medications to your journal.</p>
        </div>

        <div className="journal-snippet-header">
          <h3 className="journal-title">🌟 Active Usage Considerations</h3>
        </div>

        
        <div className="time-block component-container">
          <p className="journal-text">Check for potential drug interactions.</p>
          <br />
          <p className="journal-text">Monitor for side effects.</p>
        </div>
        

        <div className="journal-snippet-header">
          <h3 className="journal-title">❗Check for Refills!</h3>
        </div>
        <div className="time-block component-container">
          <p className="journal-text">Keep track of your medication refills.</p>
          <br />
          <p className="journal-text">Set reminders for upcoming refills.</p>
          </div>
        <div className="active-snippet"></div>
      </div>
      


{/* 
       */}

      {/* <div className="refills-snippet">
        <h3 className="journal-title">Upcoming Refills</h3>


      </div> */}
    </div>
  );
}