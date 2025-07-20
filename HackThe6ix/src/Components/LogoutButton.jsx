import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button id="logout_button" onClick={() => logout({ logoutParams: { returnTo: "http://localhost:5173/profile" } })}>
      Log Out
    </button>
  );
};

export default LogoutButton;