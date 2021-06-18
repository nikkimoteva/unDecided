import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Landing Page/App';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Docs from "./Docs/Docs";
import SignUp from "./Sign Up/SignUp";
import Demo from "./Demo/Demo";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        
        <Route path="/signup"><SignUp/></Route>
        <Route path="/docs"><Docs/></Route>
        <Route path="/demo"><Demo/></Route>
        <Route path="/"><App/></Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
