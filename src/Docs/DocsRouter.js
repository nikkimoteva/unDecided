import React from "react";
import {Switch, Route, useRouteMatch} from "react-router-dom";
import Docs from "./Docs.js";

export default function DocsRouter() {
  const {path, url} = useRouteMatch();

  // Use this to create pages based off of /docs part of url
  return <Switch>
    <Route path={path}><Docs/ ></Route>
  </Switch>;
}
