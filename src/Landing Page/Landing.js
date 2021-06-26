import React from 'react';
import Typed from 'react-typed';
import Button from "../common/Button";
import "../common/Button.css";
import "../App.css";

export default function Landing() {
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
