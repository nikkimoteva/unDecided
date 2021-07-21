import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogTitle, Hidden, makeStyles, MenuItem, Slide, TextField} from "@material-ui/core";
import {submitJob} from "../common/Managers/EndpointManager";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../common/Auth.js";
import {csvToArrays} from "../Util";
import AWSImportView from "./AWSImport/AWSImportView";
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

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
  rootDiv: {
    paddingTop: "10vh",
    paddingBottom: "10vh",
    textAlign: "center"
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
  const [header, setHeader] = useState([]);
  const [CSV, setCSV] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [dataImportSuccess, setDataImportSuccess] = useState(undefined);

  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();
  const fileInput = React.createRef();

  // checks to see if we got a file from AWS when page loads
  // useEffect(() => {
  //   const awsFile = history.location.state?.csv;
  //   if (awsFile !== undefined) {
  //     updateHeaderFields(awsFile)
  //       .then(() => {
  //         setCSV(awsFile);
  //         setDataImportSuccess(true);
  //       })
  //       .catch(err => setDataImportSuccess(false));
  //   }
  // }, []);

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

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function onFilePicked() {
    const file = fileInput.current.files[0];
    updateHeaderFields(file)
      .then(() => {
        setCSV(file);
        setDataImportSuccess(true);
      })
      .catch(err => setDataImportSuccess(false));
  }

  function getFileObjectContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  }

  // gets the header strings if file has been provided, otherwise returns empty list
  function updateHeaderFields(file) {
    return getFileObjectContent(file)
      .then(res => csvToArrays(res))
      .then(arr => {
        const headerFields = arr[0].map((field, ind) => {
          return {name: field, col: ind};
        });
        console.log(headerFields);
        setHeader(headerFields);
      });
  }

  function validateFormData() {
    if (CSV === "") {
      alert("You must upload a csv file to train on.");
      return false;
    } else if (CSV.name.substring(CSV.name.length - 3) !== 'csv') {
      alert("File name must have a .csv extension");
      return false;
    } else if (jobName.length === 0) {
      alert("Job name cannot be empty");
      return false;
    } else if (maxJobTime > maxJobTimeValue || jobTime < minJobTimeValue) {
      alert("Max Job Time must be between 10 minutes and 48 hours");
      return false;
    } else if (targetColumn.length === 0) {
      alert("You must select a target column from the dropdown");
      return false;
    } else {
      return true;
    }
  }

  function submitHandler(event) {
    event.preventDefault();
    if (validateFormData()) {
      submitJob(auth.user.email, jobName, maxJobTime, targetColumn, CSV)
        .then(res => history.push('/console/jobs'))
        .catch(err => alert("Job failed to submit"));
    }
  }

  const SlideUpTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <>
      <div className={classes.rootDiv}>
        <div>
          <Hidden smUp={dataImportSuccess === undefined || !dataImportSuccess}>
            <DoneIcon color="primary"/>
            <p style={{color: "green"}}>Successfully imported</p>
          </Hidden>
          <Hidden smUp={dataImportSuccess === undefined || dataImportSuccess}>
            <ClearIcon color="error"/>
            <p style={{color: "red"}}>Failed to import data. Try again</p>
          </Hidden>
        </div>

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
            <Hidden smUp={header.length === 0}>
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

          <Hidden smUp={header.length !== 0}>
            {/*File Input Element*/}
            <label htmlFor="fileInput">
              <input type="file"
                     accept=".csv"
                     ref={fileInput}
                     className={classes.fileInput}
                     id="fileInput"
                     name="File Input"
                     onChange={onFilePicked}
              />
              <Button color="primary" variant="outlined" component="span">
                Upload CSV
              </Button>
            </label>

            {/*AWS Import button*/}
            <Button variant="outlined" color="secondary" onClick={openModal}>Import from AWS S3</Button>
          </Hidden>

          {/*Submit button*/}
          <div>
            <Button type="submit"
                    variant="contained"
                    color="primary"
                    onClick={submitHandler}
                    style={{height: "6vh", width: "52vh"}}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>

      <Dialog
        open={showModal}
        maxWidth="lg"
        fullWidth
        onClose={closeModal}
        aria-labelledby="Import from AWS Form"
        aria-describedby="Input your AWS User details here"
        TransitionComponent={SlideUpTransition}
      >
        <DialogTitle>Import from AWS</DialogTitle>
        <AWSImportView closeModal={closeModal} setFile={setCSV} setDataImportSuccess={setDataImportSuccess}/>
      </Dialog>

    </>
  );
}
