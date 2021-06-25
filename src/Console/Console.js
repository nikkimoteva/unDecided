import React from "react";
import {Switch, Route, useRouteMatch, Redirect} from "react-router-dom";
import {getAuthCookie} from "../Managers/CookieManager";
import {useAuth} from "../Auth/Auth";


export default function Console() {
  const { path, url } = useRouteMatch();

  const auth = useAuth();

  // Use this to create pages based off of /docs part of url
  // return <Switch>
  //   <Route path={`${path}/Page1`}><></></Route>
  //   <Route path={`${path}/Page2`}><></></Route>
  //   <Route path={`${path}/Page3`}><></></Route>
  //   <Route path={path}><></></Route>  {/*Default route*/}
  // </Switch>

  return <p>{auth.user.name}</p>
}
