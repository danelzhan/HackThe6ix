import React from 'react';
import LoginButton from '../Components/LoginButton';
import LogoutButton from '../Components/LogoutButton';
import { ProfileHeader } from '../Components/ProfileHeader';
import { MedicationSection } from '../Components/MedicationSection';
import { Routes, Route, Link, useLocation } from 'react-router-dom';


export function ProfilePage({user}) {

    console.log(user)

    if (user == null) {
        console.log("noUser")
        return (
            <div id='ProfileLoginButton'>
                <LoginButton />
                <LogoutButton />
            </div>
        )
    }

    return (
        <div className="app">
            <ProfileHeader name={user.name} />
            <div>
                <MedicationSection user={user} />
                <Link to="/camera">Add more</Link>
            </div>
           
            <LogoutButton />
            

        </div>
    );
}