import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { postUser, useFetchCurrentUser } from './Bridge.js';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage } from "./Pages/HomePage.jsx"
import { JournalPage } from './Pages/JournalPage.jsx';
import { InteractionsPage } from './Pages/InteractionsPage.jsx';
import { ProfilePage } from './Pages/ProfilePage.jsx';
import { MedicationForm } from './Pages/MedicationForm.jsx';
import { LoginPage } from './LoginPage.jsx';

import { AddDrugPage } from './Pages/AddDrugPage.jsx';
import { ForumPage } from './Pages/Forum.jsx';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import ScatterPlotOutlinedIcon from '@mui/icons-material/ScatterPlotOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';

function App() {
  var [userObj, setUserObj] = useState(null); // Add this line
  const { fetchCurrentUser } = useFetchCurrentUser();
  const location = useLocation();

  // Hide nav bar on /camera
  const showNavBar = location.pathname !== "/camera";

  const [medications, setMedications] = useState([
    {
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'Every 6 hours',
      category: 'OTC',
      notes: 'Take with food'
    },
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'Metaformin',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'Advil',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'This person taking too many drugs',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
    {
      name: 'One more',
      dosage: '10mg',
      frequency: 'Once daily',
      category: 'prescription'
    },
  ]);

  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      (async () => {
        try {
          console.log(user.email)
          const fetchedUser = await fetchCurrentUser();
          setUserObj(fetchedUser);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      })();
    }
  }, [isAuthenticated, user, fetchCurrentUser]);

  return (
    <div className="app">
      {/* Routing */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/interactions" element={<InteractionsPage medications={medications} />} />
        <Route path="/profile" element={<ProfilePage user={userObj} />} />
        <Route path="/camera" element={<AddDrugPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/journal/medication-form" element={<MedicationForm />} />
        <Route path="/login" element={<LoginPage user ={userObj}/>} />
      </Routes>
      
    {showNavBar && (
        <div id="nav_bar_container">
          <nav id="nav_bar">
            <Link to="/">
              <div className="nav_bar_link_container">
                <HomeOutlinedIcon />
                <p>Home</p>
              </div>
            </Link>
            <Link to="/journal">
              <div className="nav_bar_link_container">
                <BookOutlinedIcon />
                <p>Journal</p>
              </div>
            </Link>
            <Link to="/interactions">
              <div className="nav_bar_link_container">
                <ScatterPlotOutlinedIcon />
                <p>Interactions</p>
              </div>
            </Link>
            <Link to="/profile">
              <div className="nav_bar_link_container">
                <Person2OutlinedIcon />
                <p>Profile</p>
              </div>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}

export default App;