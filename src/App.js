import React from 'react';
import "./Button.css"
import {responsiveFontSizes} from "@material-ui/core";
import {createMuiTheme, StylesProvider, ThemeProvider} from "@material-ui/core/styles";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SignUp from "./Sign Up/SignUp";
import Docs from "./Docs/Docs";
import Demo from "./Demo/Demo";
import Landing from "./Landing Page/Landing"
import {green} from "@material-ui/core/colors";

export default function App() {
  let theme = createMuiTheme({
    // See https://material-ui.com/customization/theming/

    // color palette
    palette: {
      type: "dark",
      divider: "rgba(255, 255, 255, 0.12)",
    },
    // fonts and font sizes
    typography: {},
    //default component props, like spacing, ripple effect, etc
    props: {},
    // all other component styles
    overrides: {}
  });

  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <Router>
          <Switch>
            <Route path="/signup"><SignUp/></Route>
            <Route path="/docs"><Docs/></Route>
            <Route path="/demo"><Demo/></Route>
            <Route path="/"><Landing/></Route>
          </Switch>
        </Router>
      </StylesProvider>
    </ThemeProvider>
  )
}
