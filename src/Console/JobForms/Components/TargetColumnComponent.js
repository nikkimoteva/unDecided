import {MenuItem, TextField} from "@material-ui/core";
import React from "react";


export default function TargetColumnComponent(props) {
  return (
    <div hidden={props.hidden}>
      <TextField
        select
        value={props.targetColumn}
        id="columnName"
        label="Target Column"
        variant="outlined"
        margin="normal"
        onChange={(event) => props.setTargetColumn(event.target.value)}
      >
        {
          props.header.map((field, ind) => (
            <MenuItem key={ind} value={field}>
              {field}
            </MenuItem>
          ))
        }
      </TextField>
    </div>
  );
}
