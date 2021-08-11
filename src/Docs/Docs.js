import React, {useEffect, useState} from "react";
import landing from './Screenshot/Landing.png';
import signIn from './Screenshot/Sign In.png';
import signUp from './Screenshot/Sign Up.png';
import jobPage from './Screenshot/Job Page.png';
import jobSubmission from './Screenshot/Job Submission Page.png';
import chooseCSV from './Screenshot/Choose CSV.png';
import csvLoaded from './Screenshot/CSV Loaded.png';
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


export default function Docs() {
  
  return (
    <div>
      <div>
        <h1>
          Sign in
        </h1>
        <img src={landing} alt="landing" width="70%" />
      </div>

      <div>
        <h1>
          Sign up
        </h1>
        <img src={signIn} alt="signIn" width="70%" />
      </div>

      <div>
        <h1>
          Submit Signup
        </h1>
        <img src={signUp} alt="signIn" width="70%" />
      </div>

      <div>
        <h1>
          Job Page
        </h1>
        <h3>
          Click on "New Job" to submit a training job
        </h3>
        <img src={jobPage} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Load CSV File
        </h1>
        <img src={jobSubmission} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Choose CSV File
        </h1>
        <img src={chooseCSV} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Submit Job
        </h1>
        <h3>
          Choose you prefered job time and target column
        </h3>
        <img src={submitJob} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Job Submitted
        </h1>
        <img src={jobSubmitted} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Job Trained
        </h1>
        <h3>
          Click on "New Prediction" to submit a prediction job
        </h3>
        <img src={jobTrained} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Load Prediction CSV
        </h1>
        <img src={predictionSubmission} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Choose Prediction CSV
        </h1>
        <img src={choosePredictionCSV} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Prediction CSV Loaded
        </h1>
        <img src={predictionCSVLoaded} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Prediction Job Submitted
        </h1>
        <img src={predictionSubmitted} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Expand Job to See Submited Prediction
        </h1>
        <img src={jobPagePredictionSubmitted} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Wait Until Prediction is Finished
        </h1>
        <img src={predictionExpanded} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Download the Finished Prediction
        </h1>
        <img src={predictionFinished} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Fill in AWS Secret in Profile Page
        </h1>
        <h3>
          For more information regarding to AWS setup, please refer to <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html">Create AWS Account</a>  and <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html">AWS Identity Management</a>
        </h3>
        <img src={fillInAWS} alt="signIn" width="70%" />
      </div>
      <div>
        <h1>
          Load CSV from AWS
        </h1>
        <img src={importFromAWS} alt="signIn" width="70%" />
      </div>
    </div>
  );
}

