import React, {useState, useEffect} from 'react';
import Typed from 'react-typed';
import logo from '../images/logo.png';
import figure1 from '../images/figure1.jpg';
import Button from '@material-ui/core/Button';
import RankingTable from "./RankingTable";
import Overview from "./Overview";
import {Link, useHistory} from "react-router-dom";
import {useLoginModalContext} from "../Authentication/LoginModalProvider";
import {useAuth} from "../Authentication/Auth";
import "../Common/Button";
import "../App.css";
import "./Landing.css";

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

  
  const {loginModal, setLoginModal} = useLoginModalContext();
  const auth = useAuth();
  const history = useHistory();

  function handleGetStartedOnClick() {
    if (auth.user === "") {
      setLoginModal(true);
    } else {
      history.push("/console");
    }
  }

  return (
    <div className="MainPage">
        <div className="HeaderLogo">
          <img className="initialLogo" src = {logo} alt="logo"/>
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
          <h1 className="title">State of the Art AutoML Engine</h1>
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
          <Button className="CustomLearnMore" onClick={() => setClicked(true)} variant="contained" color="primary"
                href="#outlined-buttons"
          >
            Learn More About Ensemble Squared
          </Button>
          <br/>
          <Button className="CustomContactUs" component={Link}
                      to="./contact" variant="contained" color="primary" href="#outlined-buttons"
          >
          Contact Us
          </Button>
        </div>
        <footer style={{padding: "2% 2%"}} className="copywrite">&copy; Copyright, University of British Columbia, 2021</footer>
    </div>
  );
}
