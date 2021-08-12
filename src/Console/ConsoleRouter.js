import React from "react";
import {Switch, Route, useRouteMatch} from "react-router-dom";
import Jobs from "./Jobs";
import Profile from "./Profile";

import TrainJobForm from "./JobForms/TrainJobForm";
import PredJobForm from "./JobForms/PredJobForm";


export default function ConsoleRouter() {
  const {path, url} = useRouteMatch();

  // Use this to create pages based off of /console part of url
  return (
    <Switch>
      <Route path={`${path}/profile`}><Profile/></Route>
      <Route path={`${path}/submitJob`}><TrainJobForm/></Route>
      <Route path={`${path}/submitPrediction:jobID`}><PredJobForm/></Route>
      <Route exact path={path}><Jobs url={url}/></Route> {/*Default route*/}
    </Switch>
  );
}
