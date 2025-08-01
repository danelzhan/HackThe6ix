import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button id="login_button" onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;