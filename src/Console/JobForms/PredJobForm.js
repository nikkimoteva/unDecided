import React, {useState} from "react";
import {makeStyles, Typography} from "@material-ui/core";
import {useHistory,useLocation} from "react-router-dom";
import {useAuth} from "../../Authentication/Auth.js";
import AWSImportView from "../AWSImport/AWSImportView";
import JobNameComponent from "./Components/JobNameComponent";
import SubmitButton from "./Components/SubmitButton";
import {FileUploadComponent} from "./Components/FileUploadComponent";
import DataImportStatusMsg from "./Components/DataImportStatusMsg";
import LoadingIcon from "../../Common/LoadingIcon";
import {submitPrediction} from "../../Common/Managers/EndpointManager";


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

export default function PredJobForm() {
  const [jobName, setJobName] = useState("");
  const [CSV, setCSV] = useState("");

  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [loadingValue, setLoadingValue] = useState(0);
  const [progressBarType, setProgressBarType] = useState('determinate');
  const [dataImportSuccess, setDataImportSuccess] = useState(undefined);

  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();
  const location = useLocation();

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

  function isEqualArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }

  // converts array of fields into array of json objects
  function updateCSVState(csvString) {
    const header = csvString.split('/\\r?\\n/')[0];
    const fields = header.split(',');

    if (!isEqualArrays(fields, location.state.headers)) {
      alert("The prediction dataset must have the same columns as the training dataset");
      setDataImportSuccess(false);
    } else {
      setCSV(csvString);
      setDataImportSuccess(true);
    }
  }

  function onFilePicked(file) {
    if (file.name.substring(file.name.length - 4) !== '.csv') alert("File name must have a .csv extension");
    else {
      setDataImportSuccess(undefined); // Set both so success/fail messages go away
      setIsLoadingFile(true);
      setProgressBarType('determinate');
      getFileObjectContent(file)
        .then(csvString => {
          console.log("Success!");
          updateCSVState(csvString);
        })
        .catch(err => {
          console.log(err);
          setDataImportSuccess(false);
        })
        .finally(() => setIsLoadingFile(false));
    }
  }

  function validateFormData() {
    if (CSV === "") {
      alert("You must upload a csv file to predict on.");
      return false;
      // } else
    } else if (jobName.length === 0) {
      alert("Job name cannot be empty");
      return false;
    } else {
      return true;
    }
  }

  function submitHandler(event) {
    event.preventDefault();
    if (validateFormData()) {
      submitPrediction(auth.user.email, jobName, location.state.id, CSV)
        .then(res => {
          history.push('/console/jobs');
        })
        .catch(err => {
          console.log(err);
          alert("Job failed to submit");
        });
    }
  }

  const _AWSImportView = <AWSImportView setFile={setCSV} setDataImportSuccess={setDataImportSuccess}
                                        updateCSVState={updateCSVState} setIsLoadingFile={setIsLoadingFile}
                                        setLoadingValue={setLoadingValue}
                                        setProgressBarType={setProgressBarType}
                         />;


  return (
    <div className={classes.rootDiv}>
      <h1 style={{paddingBottom: "20px"}}>Prediction Job</h1>
      <div>
        <LoadingIcon hidden={!isLoadingFile} variant={progressBarType} loadingValue={loadingValue}/>
        <DataImportStatusMsg isDataUploadSuccess={dataImportSuccess}/>
      </div>

      <form className={classes.root}>

        <FileUploadComponent hidden={dataImportSuccess || isLoadingFile} AWSImportView={_AWSImportView}
                             onFilePicked={onFilePicked}
        />

        <JobNameComponent jobName={jobName} setJobName={setJobName}/>
        <SubmitButton submitHandler={submitHandler}/>

      </form>
    </div>
  );
}
