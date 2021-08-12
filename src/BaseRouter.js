import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "./Common/Header/Header";
import {CircularProgress} from "@material-ui/core";
import {PrivateRoute} from "./Authentication/Auth";
import DocsRouter from "./Docs/DocsRouter";
import Landing from "./Landing Page/Landing";
import ContactUs from "./ContactUs/Contact";
import React, {lazy, Suspense} from "react";

export default function BaseRouter() {
  const LazyLoadConsole = lazy(() => import("./Console/ConsoleRouter"));

  return (
    <Router>
      <Header/>
      <Switch>
        <Suspense fallback={<CircularProgress/>}>
          <PrivateRoute path="/console">
            <LazyLoadConsole/>
          </PrivateRoute>
          <Route path="/docs"><DocsRouter/></Route>
          <Route path="/contact"><ContactUs/></Route>
          <Route exact path="/"><Landing/></Route>
        </Suspense>
      </Switch>
    </Router>
  );
}
