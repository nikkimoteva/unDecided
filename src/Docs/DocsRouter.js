import React from "react";
import {Switch, Route, useRouteMatch} from "react-router-dom";


export default function DocsRouter() {
  const {path, url} = useRouteMatch();

  // Use this to create pages based off of /docs part of url
  return <Switch>
    <Route path={`${path}/Page1`}><></></Route>
    <Route path={`${path}/Page2`}><></></Route>
    <Route path={`${path}/Page3`}><></></Route>
    <Route path={path}><h1 style={{textAlign: "center"}}>Docs</h1></Route>  {/*Default route*/}
  </Switch>;
}
