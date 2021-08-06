import React from "react";
import {useAuth} from "../Authentication/Auth";


export default function Profile() {
  const auth = useAuth();

  return <div style={{textAlign: "center", margin: "20px"}}>
    <p>Name: {auth.user.name}</p>
    <p>Email: {auth.user.email}</p>
    <p>Current plan: Free</p>
  </div>;
}
