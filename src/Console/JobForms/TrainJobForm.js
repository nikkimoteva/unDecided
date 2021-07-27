import React, {useState} from "react";
import {makeStyles, Typography} from "@material-ui/core";
import {submitJob} from "../../common/Managers/EndpointManager";
import {useHistory} from "react-router-dom";
import {useAuth} from "../../common/Auth.js";
import AWSImportView from "../AWSImport/AWSImportView";
import JobNameComponent from "./Components/JobNameComponent";
import JobTimeComponent from "./Components/JobTimeComponent";
import TargetColumnComponent from "./Components/TargetColumnComponent";
import SubmitButton from "./Components/SubmitButton";
import FileUploadComponent from "./Components/FileUploadComponent";
import DataImportStatusMsg from "./Components/DataImportStatusMsg";
import LoadingIcon from "../../common/LoadingIcon";

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
  }
}));

// Useful constants
const minJobTimeValue = 5;
const maxJobTimeValue = 2880; // 48 hours

export default function TrainJobForm() {
  const [jobName, setJobName] = useState("");
  const [maxJobTime, setMaxJobTime] = useState(10);
  const [timeOption, setTimeOption] = useState(1);
  const [targetColumn, setTargetColumn] = useState("");
  const [header, setHeader] = useState([]);
  const [CSV, setCSV] = useState("");

  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadingValue, setLoadingValue] = useState(0);
  const [progressBarType, setProgressBarType] = useState('determinate');
  const [dataImportSuccess, setDataImportSuccess] = useState(undefined);

  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();

  // Functions
  function getFileObjectContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => resolve(reader.result);
      reader.onprogress = (progress) => {
        // Note: We only update if we got to the next percentage point. Otherwise, too many state updates slow down file loading
        const newProgressValue = Math.round(progress.loaded / progress.total * 100.);
        if (newProgressValue !== loadingValue) setLoadingValue(newProgressValue);
      };
      reader.onerror = (err) => reject(err);
    });
  }

  // converts array of fields into array of json objects
  function updateCSVState(csvString) {
    setCSV(csvString);
    const header = csvString.split('\n')[0];
    const fields = header.split(',');
    setHeader(fields.map((field, ind) => {
      return {name: field, col: ind};
    }));
    setTargetColumn(fields[fields.length - 1]); // Default to last column, as usually the last one is the target col
    setDataImportSuccess(true);
  }

  function onFilePicked(file) {
    if (file.name.substring(file.name.length - 4) !== '.csv') alert("File name must have a .csv extension");
    else {
      setDataImportSuccess(undefined); // Set both so success/fail messages go away
      setIsLoadingFile(true);
      setProgressBarType('determinate');
      getFileObjectContent(file)
        .then(csvString => {
          updateCSVState(csvString);
        })
        .catch(err => {
          console.log(err);
          setDataImportSuccess(false);
        })
        .finally(() => setIsLoadingFile(false));
    }
  }

  function validateFormData(jobTime) {
    if (CSV === "") {
      alert("You must upload a csv file to train on.");
      return false;
      // } else
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
    const jobTime = maxJobTime * timeOption;
    if (validateFormData(jobTime)) {
      submitJob(auth.user.email, jobName, jobTime, targetColumn, CSV, header)
        .then(res => history.push('/console/jobs'))
        .catch(err => {
          console.log(err);
          alert("Job failed to submit");
        });
    }
  }

  function _AWSImportView(props) {
    return <AWSImportView setFile={setCSV} setDataImportSuccess={setDataImportSuccess}
                          updateCSVState={updateCSVState} setIsLoadingFile={setIsLoadingFile}
                          setLoadingValue={setLoadingValue}
                          setProgressBarType={setProgressBarType} {...props}
           />;
  }

  return (
    <div className={classes.rootDiv}>
      <h1 style={{paddingBottom: "20px"}}>Training Job</h1>
      <div>
        <LoadingIcon hidden={!isLoadingFile} variant={progressBarType} loadingValue={loadingValue}/>
        <DataImportStatusMsg dataImportSuccess={dataImportSuccess}/>
      </div>

      <form className={classes.root}>

        <FileUploadComponent hidden={dataImportSuccess || isLoadingFile} AWSImportView={_AWSImportView}
                             onFilePicked={onFilePicked}
        />

        <JobNameComponent jobName={jobName} setJobName={setJobName}/>

        <JobTimeComponent maxJobTime={maxJobTime} setMaxJobTime={setMaxJobTime} timeOption={timeOption}
                          setTimeOption={setTimeOption}
        />

        <TargetColumnComponent hidden={!dataImportSuccess} targetColumn={targetColumn}
                               setTargetColumn={setTargetColumn} header={header}
        />

        <SubmitButton submitHandler={submitHandler}/>

      </form>
    </div>
  );
}
