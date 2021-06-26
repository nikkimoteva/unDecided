import React from "react";
import {useAuth} from "../common/Auth";


export default function Profile() {
  const auth = useAuth();

  return <div style={{textAlign: "center", margin: "20px"}}>
    <img src={auth.user.image} alt="Profile image"/>
    <p>Name: {auth.user.name}</p>
    <p>Email: {auth.user.email}</p>
    <p>Current plan: Free</p>
  </div>
}