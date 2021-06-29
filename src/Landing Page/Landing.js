import React, {useState, useEffect} from 'react';
import Typed from 'react-typed';
import "../common/Button.css";
import "../App.css";
import Button from "../common/Button"
import logo from '../images/logo.png';
import figure1 from '../images/figure1.jpg';
import "./Landing.css"
import ButtonUI from '@material-ui/core/Button';
import RankingTable from "./RankingTable";
import Overview from "./Overview";

export default function Landing() {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      window.open('https://arxiv.org/pdf/2012.05390.pdf', '_blank');
      setClicked(false);
    }
  }, [clicked]);

  let keywords = ["Automated Machine Learning", "State Of The Art", "Accessible", 
                  "Exploiting Machine Learning Solutions", "User Friendly", "Quantitative gains", ];
  let buttonSignup = {
    name: "Get Started",
    route: "./signup"
  }

  let buttonDemo = {
    name: "autoML In Action",
    route: "./demo"
  };

  let style = {
    fontWeight: "bolder",
    fontSize: "1.5em",
    width: "50%",
    marginLeft: "25vw",
    marginBottom: "5%",
    color: "#2EFFFF",
  }

  let styleImg = {
    display: "relative",
    marginLeft: "10%",
    width: "80vw",
    height: "60vh",
    paddingBottom: "5%",
  }

  return (
    <div className="MainPage">
        <div className="HeaderLogo">
          <img className="initialLogo" src={logo} alt="logo"/>
          <Typed className="keywords" style={{"color":"#2EFFFF"}}
                 strings={keywords}
                 typeSpeed={50}
                 startDelay={500}
                 backSpeed={60}
                 showCursor={true}
                 cursorChar={'|'}
                 autoInsertCss={true}
                 shuffle={true}
                 smartBackspace={false}
                 loop={true}
          />
          <div className="ButtonUI">
            <Button data={buttonDemo}/>
            <Button data={buttonSignup}/>
          </div>
        </div>
        <div className="Comparison">
          <h1 className="title">The Most Advanced Predictive AutoML Engine</h1>
          <div id="graph" style={{"width": "80%", "margin-left":"10%",}}>
            <h3 className="subtitle">Comparison Overview</h3>
            <Overview />
            <h3 className="subtitle">Results</h3>
            <RankingTable />
          </div>
        </div>

        <div className="MoreInfo">
        <h1 className="title">Accessible Machine Learning for Everyone</h1>
        <img className="E2" style={styleImg} src={figure1} alt="figure1"/>
        <ButtonUI style={style} onClick={() => setClicked(true)} variant="contained" color="primary"
              href="#outlined-buttons">
          Learn More About Ensemble<sup>2</sup>
        </ButtonUI>
        </div>
      
        <footer className="copywrite">&copy; Copyright, University of British Columbia, 2021</footer>
    </div>
  );
}
