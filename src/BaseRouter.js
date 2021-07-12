import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./common/Header/Header";
import {CircularProgress} from "@material-ui/core";
import {PrivateRoute} from "./common/Auth";
import DocsRouter from "./Docs/DocsRouter";
import Demo from "./Demo/Demo";
import Landing from "./Landing Page/Landing";
import ContactUs from "./ContactUs/contact"
import React, {lazy, Suspense} from "react";

export default function BaseRouter() {

  // lazy load it because we don't want ppl to have to wait for this to load just to view the page
  const LazyLoadConsole = lazy(() => import("./Console/ConsoleRouter"))

  return (
    <Router>
      <Header/>
      <Switch>
        <Suspense fallback={<CircularProgress/>}>
          <PrivateRoute path="/console">
            <LazyLoadConsole/>
          </PrivateRoute>
          <Route path="/docs"><DocsRouter/></Route>
          <Route path="/demo"><Demo/></Route>
          <Route exact path="/"><Landing/></Route>
          <Route path="/contactus"><ContactUs/></Route>
        </Suspense>
      </Switch>
    </Router>
  )
}
