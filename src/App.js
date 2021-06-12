import React, { useState, useEffect } from 'react';
import Typed from 'react-typed';
import logo from './logo.png';
import Button from "./Button"
import "./Button.css"
import LoginModal from "./LoginModal";
import {Modal} from "@material-ui/core";

function App() {
  const [login, setLogin] = useState(false);

  let keywords = ["autoML", "Automated Machine Learning", "UBC", "State Of The Art"];
  let buttonSignup = {
    name: "Get Started",
    route: "./signup"
  }
  
  let buttonDemo = {
    name: "autoML In Action",
    route: "./demo"
  }
  
   function openLoginModal() {
    setLogin(true);
  }

  function closeLoginModal() {
    setLogin(false);
  }

  return (
    <div className="HeaderLogo">
      <Modal
        open={login}
        onClose={closeLoginModal}
        aria-labelledby="Login Form"
        aria-describedby="Input your login details here"
      >
        <LoginModal/>
      </Modal>

        <img className="initialLogo" src={logo} alt="logo" />
        <br/>
        <Typed className="keywords"
            strings={keywords}
            typeSpeed={50}
            startDelay= {500}
            backSpeed= {60}
            showCursor= {true}
            cursorChar= {'|'}
            autoInsertCss= {true}
            shuffle= {true}
            smartBackspace= {false}
            loop= {true}
        />
        <br/>
        <div className="ButtonUI">
          <Button data={buttonDemo} />
          <Button data={buttonSignup} />
        </div>
    </div>
);
}

export default App;
