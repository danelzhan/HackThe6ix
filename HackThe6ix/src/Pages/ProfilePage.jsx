import React from 'react';
import LoginButton from '../Components/LoginButton';
import LogoutButton from '../Components/LogoutButton';
import { ProfileHeader } from '../Components/ProfileHeader';


export function ProfilePage(user) {

    console.log(user)


    if (user.user == null) {
        console.log("noUser")
        return (
            <div id='ProfileLoginButton'>
                <LoginButton />
            </div>
        )
    }

    return (
        <div className="app">
            <ProfileHeader name={user.user.name} />
            <LogoutButton />

        </div>
    );
}