import './App.css';
import Header from "./Header";
import React, { useState, useEffect } from 'react';
import Typed from 'react-typed';
import logo from './logo.png';
import Button from "./Button"
import "./Button.css"

function App() {

  let keywords = ["autoML", "Automated Machine Learning", "UBC", "State Of The Art"];
  let buttonSignup = {
    name: "Get Started",
    route: "./signup"
  }
  
  let buttonDemo = {
    name: "autoML In Action",
    route: "./demo"
  }

  return (
    <div className="HeaderLogo">
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
