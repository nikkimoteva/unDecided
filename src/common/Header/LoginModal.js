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
            clientId={google_id}
            buttonText="Login with Google"
            onSuccess={this.props.signin}
            onFailure={(res) => console.log(res)}
            cookiePolicy="http://localhost:3000"
          />
        </div>
      </DialogContent>
    )
  }
}
