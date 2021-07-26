import {MenuItem, TextField} from "@material-ui/core";
import React from "react";

const jobTimeOptions = [
  {name: "minutes", value: 1},
  {name: "hours", value: 60}
];

export default function JobTimeComponent(props) {
  function handleMaxJobTimeChange(event) {
    const newValue = event.target.value;
    if (!isNaN(newValue)) props.setMaxJobTime(newValue);
  }

  function handleTimeOptionChange(event) {
    props.setTimeOption(parseInt(event.target.value));
  }

  return (
    <div>
      <TextField
        id="maxJobTime"
        label="Max Job Time"
        variant="outlined"
        value={props.maxJobTime}
        onChange={handleMaxJobTimeChange}
        margin="normal"
      />
      <TextField
        select
        variant="outlined"
        value={props.timeOption}
        onChange={handleTimeOptionChange}
      >
        {
          jobTimeOptions.map((option) => (
            <MenuItem key={option.name} value={option.value}>{option.name}</MenuItem>
          ))
        }
      </TextField>
    </div>
  );
}
