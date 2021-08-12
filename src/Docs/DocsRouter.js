import React from "react";
import {Route, useRouteMatch} from "react-router-dom";
import Docs from "./Docs.js";

export default function DocsRouter() {
  const {path, url} = useRouteMatch();
  return <Route path={path}><Docs/></Route>;
}
