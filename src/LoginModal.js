import {Link} from "react-router-dom";
import {Button, TextField} from "@material-ui/core";
import {useState} from "react";


export default function LoginModal(props) {
  const onSignIn = props.onSignIn;
  return (
    <div className="g-signin2" data-onsuccess={onSignIn}/>
  );
}
