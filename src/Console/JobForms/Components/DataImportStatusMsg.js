import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import React from "react";

const successMsg = (
  <div>
    <DoneIcon color="primary"/>
    <p style={{color: "green"}}>Successfully imported</p>

  </div>
);
const failMsg = (
  <div>
    <ClearIcon color="error"/>
    <p style={{color: "red"}}>Failed to import data. Try again</p>

  </div>
);

export default function DataImportStatusMsg(props) {
  if (props.isDataUploadSuccess === true) return successMsg;
  else if (props.isDataUploadSuccess === false) return failMsg;
  else return <div style={{display: "none"}}/>;
}
