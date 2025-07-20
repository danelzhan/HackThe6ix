import React from 'react';
import LoginButton from '../Components/LoginButton';
import LogoutButton from '../Components/LogoutButton';
import { ProfileHeader } from '../Components/ProfileHeader';
import { MedicationSection } from '../Components/MedicationSection';


export function ProfilePage(user) {

    console.log(user)

    if (user.user == null) {
        return (
            <LoginButton />
        )
    } else {
    return (
        <div className="app">

            <ProfileHeader name={user.user.name} />
            <LogoutButton />
            

        </div>
    );
    }

    


}