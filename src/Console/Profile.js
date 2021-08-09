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

    <AWSImportForm onSubmit={registerAWSAccount}/>
    <p>{auth.user.name}'s Profile</p>
    <p>Email: {auth.user.email}</p>
    <p>Current plan: Free</p>
  </div>;
}
