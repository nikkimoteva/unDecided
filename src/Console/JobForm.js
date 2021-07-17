import React, {useEffect, useState} from "react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import {submitJob} from "../common/Managers/EndpointManager";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../common/Auth.js";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '50ch',

  },
  textField: {
    transform: 'translate(14px, 7px) scale(1)',
    width: '20ch',
  },
  numberTextField: {
    transform: 'translate(20px, 0px) scale(1)',
    width: '15ch',
  },
  fileField: {
    transform: 'translate(20px, 15px) scale(1)',
    width: '25ch',
  },

  submitButton: {
    transform: 'translate(20px, 15px) scale(1)',
  },
  button: {
    transform: 'translate(15px, 15px) scale(1)',
  }
});

export default function JobForm(props) {
  const [jobName, setJobName] = useState("");
  const [maxJobTime, setMaxJobTime] = useState(10);
  const maxJobTimeValue = 20;

  const classes = useStyles();
  const auth = useAuth();
  const fileInput = React.createRef();

  const history = useHistory();

  function submitHandler(event) {
    event.preventDefault();
    const file = (history.location.state?.csv === undefined) ? fileInput.current.files[0] : history.location.state.csv;
    const filename = file.name;
    if (filename.substring(filename.length - 3) === 'csv') {
      submitJob(auth.user.email, jobName, maxJobTime, file)
        .then(res => history.push('/console/jobs'))
        .catch(err => alert("Job failed to submit"));
    } else {
      alert("File type is not csv");
    }
  }

  function handleMaxJobTimeChange(event) {
    const value = parseInt(event.target.value);
    if (value <= maxJobTimeValue && value >= 1) setMaxJobTime(value);
  }

  return (
    <div>
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
            className={classes.numberTextField}
          />
          {history.location.state === undefined &&
          <input type="file" ref={fileInput} className={classes.fileField}/>
          }
          <Button type="submit"
                  variant="outlined"
                  color="primary"
                  className={classes.submitButton}
                  onClick={submitHandler}
          >
            Submit
          </Button>
        </div>
      </form>

      <Button variant="contained"
              color="secondary"
              className={classes.button}
              component={Link}
              to="/console/import"
      >
        Import from AWS S3
      </Button>
    </div>

  );
}
