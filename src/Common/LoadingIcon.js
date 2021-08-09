import {CircularProgress} from "@material-ui/core";
import React from "react";


export default function LoadingIcon(props) {
  return (
    <div hidden={props.hidden}>
      <p>Loading Dataset </p>
      <CircularProgress variant={props.variant} value={props.loadingValue}/>
    </div>
  );
}
