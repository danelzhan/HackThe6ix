import React from 'react';
import LoginButton from '../Components/LoginButton';
import LogoutButton from '../Components/LogoutButton';
import { ProfileHeader } from '../Components/ProfileHeader';
import { MedicationSection } from '../Components/MedicationSection';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';


export function ProfilePage({user}) {

    const navigate = useNavigate()

    console.log(user)

    if (user == null) {
        return (
            <LoginButton />
        )
    } else {
    return (
        <div className="app">

            <ProfileHeader name={user.name} />
            <p onClick={() => {navigate("/camera")}}>Add more.</p>
            <LogoutButton />
            

        </div>
    );
    }

    


}