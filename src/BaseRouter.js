import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./common/Header/Header";
import {CircularProgress} from "@material-ui/core";
import {PrivateRoute} from "./common/Auth";
import Docs from "./Docs/Docs";
import Demo from "./Demo/Demo";
import Landing from "./Landing Page/Landing";
import React, {lazy, Suspense} from "react";

export default function BaseRouter() {

  // lazy load it because we don't want ppl to have to wait for this to load just to view the page
  const LazyLoadConsole = lazy(() => import("./Console/Console"))

  return (
    <Router>
      <Header/>
      <Switch>
        <Suspense fallback={<CircularProgress/>}>
          <PrivateRoute path="/console">
            <LazyLoadConsole/>
          </PrivateRoute>
          <Route path="/docs"><Docs/></Route>
          <Route path="/demo"><Demo/></Route>
          <Route exact path="/"><Landing/></Route>
        </Suspense>
      </Switch>
    </Router>
  )
}
