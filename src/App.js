import React, {useState} from 'react';
import "./Button.css"
import {Modal, responsiveFontSizes} from "@material-ui/core";
import {createMuiTheme, StylesProvider, ThemeProvider} from "@material-ui/core/styles";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import SignUp from "./Sign Up/SignUp";
import Docs from "./Docs/Docs";
import Demo from "./Demo/Demo";
import Landing from "./Landing Page/Landing"
import LoginModal from "./LoginModal";
import Header from "./Header";
import Console from "./Console/Console"
import {PrivateRoute} from "./Auth/Auth";

export default function App() {
  const [loginModal, setLoginModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

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

  function handleLogin() {

  }

  function openLoginModal() {
    setLoginModal(true);
  }

  function closeLoginModal() {
    setLoginModal(false);
  }

  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <Router>
          <Header handleLogin={handleLogin}/>
          <Modal
            open={loginModal}
            onClose={closeLoginModal}
            aria-labelledby="Login Form"
            aria-describedby="Input your login details here"
          >
            <LoginModal/>
          </Modal>
          <Switch>
            <PrivateRoute path="/console">
            </PrivateRoute>
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
