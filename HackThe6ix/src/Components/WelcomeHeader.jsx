import React from 'react';
import '../App.css'
import { useState, useEffect } from 'react';

const useTimeGreeting = () => {
  const [greeting, setGreeting] = useState('Hello');
  
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) {
        setGreeting('Good morning');
      } else if (hour < 18) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    };
    
    updateGreeting();
    
    const interval = setInterval(updateGreeting, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return greeting;
};

const WelcomeHeader = ({ name }) => {
    const greeting = useTimeGreeting();
    return (
        <div className="gradient-header">
        
         <h3>{greeting}{name ? `, ${name}` : ''}!</h3>
        
        </div>
    );
};

export default WelcomeHeader;