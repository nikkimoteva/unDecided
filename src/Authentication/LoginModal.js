import GoogleLogin from "react-google-login";
import React from "react";
import {DialogContent} from "@material-ui/core";

export default class LoginModal extends React.Component {
  render() {
    return (
      <DialogContent>
        <div style={{height: "50%"}} onClick={this.props.onClose}/>
        <div style={{margin: "auto", display: "table"}} onClick={this.props.onClose}>
          <GoogleLogin
            clientId="296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={this.props.signin}
            onFailure={(err) => console.error(err)}
            cookiePolicy="https://ensemble-automl.herokuapp.com" // replace with `http://localhost:3000` if debugging locally
          />
        </div>
      </DialogContent>
    );
  }
}
