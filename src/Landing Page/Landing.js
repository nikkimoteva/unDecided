import React, {useState, useEffect} from 'react';
import Typed from 'react-typed';
import CustomButton from "../common/Button";
import logo from '../images/logo.png';
import figure1 from '../images/figure1.jpg';
import Button from '@material-ui/core/Button';
import RankingTable from "./RankingTable";
import Overview from "./Overview";
import "../common/Button.css";
import "../App.css";
import "./Landing.css";
import {Link, useHistory} from "react-router-dom";
import {useLoginModalContext} from "../common/LoginModalProvider";
import {useAuth} from "../common/Auth";

export default function Landing() {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      window.open('https://arxiv.org/pdf/2012.05390.pdf', '_blank');
      setClicked(false);
    }
  }, [clicked]);

  const keywords = ["Automated Machine Learning", "State Of The Art", "Accessible", 
                  "Exploiting Machine Learning Solutions", "User Friendly", "Quantitative gains",
                  "Minimal Configuration Necessary", "No ML experience necessary"];

  const setLoginModal = useLoginModalContext().setLoginModal;
  const auth = useAuth();
  const history = useHistory();

  function handleGetStartedOnClick() {
    /* eslint-disable no-implicit-coercion, eqeqeq */
    if (auth.user == null) setLoginModal(true);
    else history.push("/console");
  }

  return (
    <div className="MainPage">
        <div className="HeaderLogo">
          <Typed className="keywords" style={{color:"#DEE"}}
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
            <Button className="CustomButton" component={Link}
                    to="./demo" variant="contained" color="primary" href="#outlined-buttons"
            >
              autoML In Action
            </Button>

            <Button className="CustomButton" variant="contained"
                    color="primary" onClick={handleGetStartedOnClick}
            >
              Get Started
            </Button>

          </div>
        </div>
        <div className="Comparison">
          <h1 className="title">The Most Advanced Predictive AutoML Engine</h1>
          <div id="graph" style={{width: "80%", marginLeft: "10%",}}>
            <h3 className="subtitle">Comparison Overview</h3>
            <Overview />
            <h3 className="subtitle">Results</h3>
            <RankingTable />
          </div>
        </div>

        <div className="MoreInfo">
        <h1 className="title">Accessible Machine Learning for Everyone</h1>
        <img className="img" src={figure1} alt="figure1"/>
        <Button className="button" onClick={() => setClicked(true)} variant="contained" color="primary"
              href="#outlined-buttons"
        >
          Learn More About Ensemble<sup>2</sup>
        </Button>
        </div>
        <footer className="copywrite">&copy; Copyright, University of British Columbia, 2021</footer>
    </div>
  );
}
