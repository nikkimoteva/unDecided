import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import landing from './Screenshot/Landing.png';
import signIn from './Screenshot/Sign In.png';
import signUp from './Screenshot/Sign Up.png';
import jobPage from './Screenshot/Job Page.png';
import jobSubmission from './Screenshot/Job Submission Page.png';
import chooseCSV from './Screenshot/Choose CSV.png';
import submitJob from './Screenshot/Submit Job.png';
import jobSubmitted from './Screenshot/Job Page Submitted.png';
import jobTrained from './Screenshot/Job Trained.png';
import predictionSubmission from './Screenshot/Prediction Submission Page.png';
import choosePredictionCSV from './Screenshot/Choose Prediction CSV.png';
import predictionCSVLoaded from './Screenshot/Prediction CSV Loaded.png';
import predictionSubmitted from './Screenshot/Submit Prediction.png';
import jobPagePredictionSubmitted from './Screenshot/Job Page Prediction Submitted.png';
import predictionExpanded from './Screenshot/Prediction Expanded.png';
import predictionFinished from './Screenshot/Prediction Finished.png';
import fillInAWS from './Screenshot/Fill in AWS Keys.png';
import importFromAWS from './Screenshot/Import From AWS.png';

const useStyles = makeStyles({
  image: {
    width: "70%",
    padding: '0 15%',
  },
  title: {
    padding: '0 15%',
  },

});

export default function Docs() {

  const classes = useStyles();
  
  return (
    <div>
      <div>
        <h1 className={classes.title}>
          Sign in
        </h1>
        <img src={landing} alt="landing" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Sign up
        </h1>
        <img src={signIn} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Submit Signup
        </h1>
        <img src={signUp} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Job Page
        </h1>
        <h3 className={classes.title}>
          Click on "New Job" to submit a training job
        </h3>
        <img src={jobPage} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Load CSV File
        </h1>
        <img src={jobSubmission} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Choose CSV File
        </h1>
        <img src={chooseCSV} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Submit Job
        </h1>
        <h3 className={classes.title}>
          Choose you prefered job time and target column
        </h3>
        <img src={submitJob} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Job Submitted
        </h1>
        <img src={jobSubmitted} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Job Trained
        </h1>
        <h3 className={classes.title}>
          Click on "New Prediction" to submit a prediction job
        </h3>
        <img src={jobTrained} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Load Prediction CSV
        </h1>
        <img src={predictionSubmission} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Choose Prediction CSV
        </h1>
        <img src={choosePredictionCSV} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Prediction CSV Loaded
        </h1>
        <img src={predictionCSVLoaded} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Prediction Job Submitted
        </h1>
        <img src={predictionSubmitted} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Expand Job to See Submited Prediction
        </h1>
        <img src={jobPagePredictionSubmitted} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Wait Until Prediction is Finished
        </h1>
        <img src={predictionExpanded} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Download the Finished Prediction
        </h1>
        <img src={predictionFinished} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Fill in AWS Secret in Profile Page
        </h1>
        <h3 className={classes.title}>
          For more information regarding to AWS setup, please refer to <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html">Create AWS Account</a>  and <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html">AWS Identity Management</a>
        </h3>
        <img src={fillInAWS} alt="signIn" className={classes.image} />
      </div>
      <hr/>
      <div>
        <h1 className={classes.title}>
          Load CSV from AWS
        </h1>
        <img src={importFromAWS} alt="signIn" className={classes.image} />
      </div>
    </div>
  );
}

