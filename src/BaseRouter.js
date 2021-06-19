import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Header from "./Header";
import {Modal} from "@material-ui/core";
import LoginModal from "./LoginModal";
import {PrivateRoute, useAuth} from "./Auth/Auth";
import Console from "./Console/Console";
import SignUp from "./Sign Up/SignUp";
import Docs from "./Docs/Docs";
import Demo from "./Demo/Demo";
import Landing from "./Landing Page/Landing";
import React, {useState} from "react";


export default function BaseRouter() {
  const [loginModal, setLoginModal] = useState(false);

  const auth = useAuth();

  function handleLogin(user) {
    return auth.signin(user)
      .then(profile => {
        console.log(profile);
      })
      .catch(error => console.log(error));
  }

  function openLoginModal() {
    setLoginModal(true);
  }

  function closeLoginModal() {
    setLoginModal(false);
  }

  if (auth.user !== null) return <Redirect to="/console"/>

  return (
    <Router>
      <Header openLogin={openLoginModal}/>
      <Modal
        open={loginModal}
        onClose={closeLoginModal}
        aria-labelledby="Login Form"
        aria-describedby="Input your login details here"
      >
        <LoginModal onSignIn={handleLogin}/>
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
