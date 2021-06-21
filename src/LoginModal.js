import GoogleLogin from "react-google-login";
import React from "react";

export default function LoginModal(props) {
  return (
    <>
      <div style={{height: "50%"}}/>
      <div style={{margin: "auto", display: "block", width: "-moz-fit-content"}}>
        <GoogleLogin
          clientId="296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={props.signin}
          onFailure={(res) => console.log(res)}
          cookiePolicy="http://localhost:3000"
        />
      </div>
    </>
  )
}
