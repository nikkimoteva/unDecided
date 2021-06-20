import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Header from "./Header";
import {Modal} from "@material-ui/core";
import {PrivateRoute, useAuth} from "./Auth/Auth";
import Console from "./Console/Console";
import SignUp from "./Sign Up/SignUp";
import Docs from "./Docs/Docs";
import Demo from "./Demo/Demo";
import Landing from "./Landing Page/Landing";
import React, {useState} from "react";
import GoogleLogin from "react-google-login";
import LoginModal from "./LoginModal";
import {validateGoogleUser} from "./Endpoints";

export default function BaseRouter() {
  const [loginModal, setLoginModal] = useState(false);

  const auth = useAuth();

  function handleLogin(res) {
    const profileInfo = auth.signin(res);
    // todo store profile in state. Will be tricky, preferably in a cookie
    const id_token = res.getAuthResponse().id_token;
    validateGoogleUser(id_token)
      .then(res => {
        console.log("Stored info in backend")
      })
      .catch(err => {
        console.log(err);
      });
  }

  function openLoginModal() {
    setLoginModal(true);
  }

  function closeLoginModal() {
    setLoginModal(false);
  }

  return (
    <Router>
      <Header openLogin={openLoginModal}/>
      <Modal
        open={loginModal}
        onClose={closeLoginModal}
        aria-labelledby="Login Form"
        aria-describedby="Input your login details here"
      >
        <LoginModal signin={handleLogin}/>
      </Modal>
      <Switch>
        <PrivateRoute path="/console"><Console/></PrivateRoute>
        <Route path="/signup"><SignUp/></Route>
        <Route path="/docs"><Docs/></Route>
        <Route path="/demo"><Demo/></Route>
        <Route path="/"><Landing/></Route>
      </Switch>
    </Router>
  )

}
