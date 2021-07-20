import React, {useEffect, useState} from "react";
import {Button, Hidden, makeStyles, MenuItem, TextField} from "@material-ui/core";
import {submitJob} from "../common/Managers/EndpointManager";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../common/Auth.js";
import {csvToArrays} from "../Util";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  fileInput: {
    display: "none"
  }
}));

export default function JobForm() {
  const [jobName, setJobName] = useState("");
  const [maxJobTime, setMaxJobTime] = useState(10);
  const [timeOption, setTimeOption] = useState(1);
  const [targetColumn, setTargetColumn] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [header, setHeader] = useState([]);

  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();
  const fileInput = React.createRef();

  useEffect(() => {
    if (fileInput.current?.files[0] !== undefined || history.location.state?.csv) getHeaderFields();
  }, [fileInput.current, history.location.state]);

  // Useful constants
  const minJobTimeValue = 5;
  const maxJobTimeValue = 2880; // 48 hours
  const jobTimeOptions = [
    {name: "minutes", value: 1},
    {name: "hours", value: 60}
  ];
  const jobTime = maxJobTime * timeOption;

  // Functions
  function handleMaxJobTimeChange(event) {
    const newValue = event.target.value;
    if (!isNaN(newValue)) setMaxJobTime(newValue);
  }

  function getUploadedFile() {
    return (history.location.state?.csv === undefined)
      ? fileInput.current?.files[0]  // uploaded file
      : history.location.state.csv; // aws file
  }

  // gets the header strings if file has been provided, otherwise returns empty list
  function getHeaderFields() {
    const file = getUploadedFile();
    if (file === undefined) return [];
    return csvToArrays(file)
      .then(arr => {
        setHeader(arr[0].map((field, ind) => {
          return {name: field, col: ind};
        }));
      })
      .catch(err => alert("Unable to get header fields for given file"));
  }

  function isInvalidForm() {
    return hasSubmitted
      && ((maxJobTime <= maxJobTimeValue && jobTime >= minJobTimeValue)
        || jobName.length === 0
        || targetColumn.length === 0);
  }

  function submitHandler(event) {
    event.preventDefault();
    setHasSubmitted(true);
    const file = getUploadedFile();
    if (file !== undefined && file.name.substring(file.name.length - 3) !== 'csv') {
      alert("File name must be a csv");
    } else if (isInvalidForm()) {
      alert("Form invalid. Try again.");
    } else {
      const file = getUploadedFile();
      submitJob(auth.user.email, jobName, maxJobTime, targetColumn, file)
        .then(res => history.push('/console/jobs'))
        .catch(err => alert("Job failed to submit"));
    }
  }

  return (
    <div style={{paddingTop: "10vh", paddingBottom: "10vh", textAlign: "center"}}>
      <form className={classes.root}>

        {/*Job Name*/}
        <div>
          <TextField
            id="jobName"
            label="Job Name"
            value={jobName}
            variant="outlined"
            style={{width: "52vh"}}
            onChange={(event) => setJobName(event.target.value)}
          />
        </div>

        {/*Job Time*/}
        <div>
          <TextField
            id="maxJobTime"
            label="Max Job Time"
            variant="outlined"
            value={maxJobTime}
            onChange={handleMaxJobTimeChange}
            margin="normal"
          />
          <TextField
            select
            variant="outlined"
            value={timeOption}
            onChange={(event) => setTimeOption(parseInt(event.target.value))}
          >
            {
              jobTimeOptions.map((option) => (
                <MenuItem key={option.name} value={option.value}>{option.name}</MenuItem>
              ))
            }
          </TextField>
        </div>

        {/*Target Column*/}
        <div>
          <Hidden smUp={getUploadedFile() === undefined}>
            <TextField
              select
              id="columnName"
              label="Target Column"
              variant="outlined"
              margin="normal"
              onChange={(event) => setTargetColumn(event.target.value)}
            >
              {
                header.map((field) => (
                  <MenuItem key={field.col} value={field.name}>
                    {field.name}
                  </MenuItem>
                ))
              }
            </TextField>
          </Hidden>
        </div>

        <Hidden smUp={getUploadedFile() !== undefined}>
          {/*File Input Element*/}
          <label htmlFor="fileInput">
            <input type="file" accept=".csv" ref={fileInput} className={classes.fileInput} id="fileInput"
                   name="File Input"/>
            <Button color="primary" variant="outlined" component="span">
              Upload CSV
            </Button>
          </label>

          {/*AWS Import button*/}
          <Button variant="outlined"
                  color="secondary"
                  component={Link}
                  to="/console/import"
          >
            Import from AWS S3
          </Button>
        </Hidden>

        {/*Submit button*/}
        <div>
          <Button type="submit"
                  variant="contained"
                  color="primary"
                  onClick={submitHandler}
                  style={{height: "5vh", width: "52vh"}}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
