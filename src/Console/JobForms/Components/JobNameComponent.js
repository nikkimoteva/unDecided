import {TextField} from "@material-ui/core";
import React from "react";


export default function JobNameComponent(props) {
  return (
    <div>
      <TextField
        id="jobName"
        label={props.placeholder}
        value={props.jobName}
        variant="outlined"
        style={{width: "52vh"}}
        onChange={(event) => props.setJobName(event.target.value)}
      />
    </div>
  );
}
