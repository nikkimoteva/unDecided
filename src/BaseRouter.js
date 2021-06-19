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


export default function BaseRouter() {
  const [loginModal, setLoginModal] = useState(false);

  const auth = useAuth();

  function handleLogin(res) {
    console.log(res);
    const profile = auth.signin(res); // todo store profile in state. Will be tricky, preferably in a cookie
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
      {/*<Modal*/}
      {/*  open={loginModal}*/}
      {/*  onClose={closeLoginModal}*/}
      {/*  aria-labelledby="Login Form"*/}
      {/*  aria-describedby="Input your login details here"*/}
      {/*>*/}
      {/*</Modal>*/}
      <GoogleLogin
        clientId="296036318202-uraiim5u0cf5qpqhujl3aaj1kniuu41e.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={handleLogin}
        onFailure={(res) => console.log(res)}
        cookiePolicy="http://localhost:3000"
      />
      <Switch>
        <PrivateRoute path="/console"><Console/></PrivateRoute>
        <Route path="/signup"><SignUp/></Route>
        <Route path="/docs"><Docs/></Route>
        <Route path="/demo"><Demo/></Route>
        <Route path="/"><Landing/></Route>
      </Switch>
      {auth.user !== null && <Redirect to="/console"/>}
    </Router>
  )

}
