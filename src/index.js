import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Landing Page/App';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {createMuiTheme, makeStyles, ThemeProvider, StylesProvider} from '@material-ui/core/styles';
import Docs from "./Docs/Docs";
import SignUp from "./Sign Up/SignUp";
import Demo from "./Demo/Demo";
import {responsiveFontSizes} from "@material-ui/core";
import {green} from "@material-ui/core/colors";


let theme = createMuiTheme({
  // See https://material-ui.com/customization/theming/

  // color palette
  palette: {
    type: "dark",
    divider: "rgba(255, 255, 255, 0.12)",
  },
  // fonts and font sizes
  typography: {

  },
  //default component props, like spacing, ripple effect, etc
  props: {},
  // all other component styles
  overrides: {}
});

theme = responsiveFontSizes(theme);

ReactDOM.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <Router>
            <Switch>
              <Route path="/signup"><SignUp/></Route>
              <Route path="/docs"><Docs/></Route>
              <Route path="/demo"><Demo/></Route>
              <Route path="/"><App/></Route>
            </Switch>
          </Router>
        </StylesProvider>
      </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
