import React from 'react';

export function ProfileHeader({name}) {

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB');
    const hour = Number(timeString.split(':')[0]);

    var greeting = "Hello";

    if (hour >= 3 && hour < 12) {
        greeting = "Good morning";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
  
    return  <div className="gradient-header profile-header">

        <p className="greeting">{greeting}, {name}</p>

    </div>

}