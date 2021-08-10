import React from "react";
import {useAuth} from "../Authentication/Auth";
import {getAuthCookie} from "../Common/Managers/CookieManager";
import AWSImportForm from "./AWSImport/Form";
import { addAWSCred } from "../Common/Managers/EndpointManager";



export default function Profile() {
  const auth = useAuth();

  function registerAWSAccount(accessKey, secretKey) {
    const cookie = getAuthCookie();
    return addAWSCred(cookie.email, accessKey, secretKey);
  }

  return <div style={{textAlign: "center", margin: "20px"}}>
    <h1><b>{auth.user.name}'s Profile</b></h1>
    <h3>Email: {auth.user.email}</h3>
    <h3>Current plan: Free</h3>
    <br/>
    <h3><u>Connect to AWS S3:</u></h3>
    <h4>(Please refer to our documentations for more information on connecting.)</h4>
    <AWSImportForm onSubmit={registerAWSAccount}/>
  </div>;
}
