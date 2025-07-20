import React from 'react';
import WelcomeHeader from '../Components/WelcomeHeader';
import { FiChevronRight} from 'react-icons/fi';
import { DrugBottomSheet } from '../Components/DrugBottomSheet';

export function HomePage() {

  return (
    <div className="app">
      <DrugBottomSheet />
      {/* <div className="component-container">
        <WelcomeHeader name="User" />
      </div>

      <div className="journal-snippet">
        <h3 className="journal-title">Journal</h3>
        <button className="invisi-button" onClick={() => window.location.href = '/journal'}>
        <FiChevronRight  size={24} />
        </button>

      </div>

      <div className="active-snippet">
        <h3 className="journal-title">Active Usage Considerations</h3>

      </div>

      <div className="refills-snippet">
        <h3 className="journal-title">Upcoming Refills</h3>


      </div> */}
    </div>
  );
}