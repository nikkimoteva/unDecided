import React from "react";
import {Switch, Route, useRouteMatch} from "react-router-dom";
import Dashboard from "./Dashboard";
import Jobs from "./Jobs";
import Profile from "./Profile";
import JobForm from "./JobForm";
import Settings from "./Settings";
import AWSImportView from "./AWSImport/AWSImportView";

export default function ConsoleRouter() {
  const {path, url} = useRouteMatch();

  // Use this to create pages based off of /console part of url
  return (
    <Switch>
      <Route path={`${path}/jobs`}><Jobs url={url}/></Route>
      <Route path={`${path}/profile`}><Profile/></Route>
      <Route path={`${path}/submitJob`}><JobForm/></Route>
      <Route path={`${path}/settings`}><Settings/></Route>
      <Route path={`${path}/import`}><AWSImportView/></Route>
      <Route exact path={path}><Dashboard/></Route> {/*Default route*/}
    </Switch>
  );
}
