import React, {useState} from "react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import {submitJob} from "../common/Managers/EndpointManager";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '50ch',

  },
  textField: {
    width: '25ch',
  },
  longTextField: {
    width: '50ch',
  }
});

export default function JobForm() {
  const [jobName, setJobName] = useState("");
  const [maxJobTime, setMaxJobTime] = useState(10);
  const maxJobTimeValue = 20;

  const classes = useStyles();
  const fileInput = React.createRef();

  async function submitHandler(event) {
    event.preventDefault();
    const file = fileInput.current.files[0];
    const filename = file.name;
    if (filename.substring(filename.length - 3) === 'csv') {
      await submitJob(jobName, maxJobTime, file);
    } else {
      alert("File type is not csv");
    }
  }

  function handleMaxJobTimeChange(event) {
    const value = parseInt(event.target.value);
    if (value <= maxJobTimeValue && value >= 1) setMaxJobTime(value);
  }

  return (
    <form noValidate>
      <div>
        <TextField id="jobName"
                   label="Job Name"
                   value={jobName}
                   variant="outlined"
                   className={classes.textField}
                   onChange={(event) => setJobName(event.target.value)}
        />
        <TextField
          id="maxJobTime"
          label="Max Job Time (Minutes)"
          type="number"
          value={maxJobTime}
          onChange={handleMaxJobTimeChange}
          margin="normal"
        />
        <input type="file" ref={fileInput}/>
        <Button type="submit"
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={submitHandler}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
