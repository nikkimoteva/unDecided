import GoogleLogin from "react-google-login";
import React from "react";

export default class LoginModal extends React.Component {
  render() {
    return (
      <>
        <div style={{height: "50%"}} onClick={this.props.onClose}/>
        <div style={{margin: "auto", display: "block", width: "-moz-fit-content"}} onClick={this.props.onClose}>
          <GoogleLogin
            clientId="296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={this.props.signin}
            onFailure={(res) => console.log(res)}
            cookiePolicy="http://localhost:3000"
          />
        </div>
      </>
    )
  }
}
