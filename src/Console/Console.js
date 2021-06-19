import React from "react";
import {Switch, Route, useRouteMatch, Redirect} from "react-router-dom";


export default function Console(props) {
  const loggedIn = props.loggedIn;
  const { path, url } = useRouteMatch();

  if (!loggedIn) return <Redirect to={}/> // TODO: This needs to change: https://reactrouter.com/web/example/auth-workflow

  // Use this to create pages based off of /docs part of url
  return <Switch>
    <Route path={`${path}/Page1`}><></></Route>
    <Route path={`${path}/Page2`}><></></Route>
    <Route path={`${path}/Page3`}><></></Route>
    <Route path={path}><></></Route>  {/*Default route*/}
  </Switch>
}
