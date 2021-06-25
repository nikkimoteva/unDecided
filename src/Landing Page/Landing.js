import React, { useState, useEffect } from 'react';
import Typed from 'react-typed';
import Button from "../common/Button"
import logo from '../logo.png';
import figure1 from './figure1.jpg';
import Graph from "./ChooseGraph"
import "./Graph.css"
import ButtonUI from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import { Animator, ScrollContainer, ScrollPage, batch, Fade, FadeIn, Move, MoveOut, Sticky, StickyIn, ZoomIn } from "react-scroll-motion";


export default function Landing() {


  // const [window, setWindow] = useState(false);

  // function handleClick() {
  //   window.setWindow('https://arxiv.org/pdf/2012.05390.pdf','_blank');
  // }

  // let changeHandler = handleClick.bind(this); 
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      // do something meaningful, Promises, if/else, whatever, and then
      // window.location.assign('https://arxiv.org/pdf/2012.05390.pdf','_blank');
      window.open('https://arxiv.org/pdf/2012.05390.pdf','_blank');
    }
  });

  let keywords = ["autoML", "Automated Machine Learning", "UBC", "State Of The Art"];
  let buttonSignup = {
    name: "Get Started",
    route: "./signup"
  }
  let accuracy = "accuracy"
  let rank = "rank";
  let first = "first";

  let buttonDemo = {
    name: "autoML In Action",
    route: "./demo"
  }
  
  let style = {
    "fontWeight": "bolder",
    "fontSize": "1.5em",
    "width" : "50%",
    "margin-left": "25vw",
}

let styleImg = {
  "display": "relative",
  "margin-left": "10%",
  "width" : "80vw",
  "height": "60vh"
}

  const FadeUp = batch(Fade(), Move(), Sticky());

  return (
    <div className="MainPage">
    <section>
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
    </section>
    <br></br>
    <hr style={{"width": "100%"}}></hr>

<section>
  <br></br>
      <h1 className="title">What is Ensembled<sup>2</sup>?</h1>
      <img className="E2" style={styleImg} src={figure1} alt="figure1" />
    <ScrollContainer>
      <ScrollPage page={2}>
        <Animator animation={batch(Fade(), Sticky(), MoveOut(0, -300))}>
          <span style={{ fontSize: "2em" }}>"This web system greatly increases the accessibility of machine learning for the general public"</span>
          </Animator>
      </ScrollPage>
      <ScrollPage page={3}>
        <Animator animation={batch(FadeUp, MoveOut(0, -1000))}>
          <span style={{ fontSize: "2em" }}>"ensembling at the AutoML system level..."</span>
          <br></br><br></br><br></br>
          <span style={{ fontSize: "2em" }}>"quantitative gains in accuracy..."</span>
          <br></br><br></br><br></br>
          <span style={{ fontSize: "2em" }}>"...exploiting machine learning solutions"</span>
        </Animator>
      </ScrollPage>
      <ScrollPage page={4}>
        <Animator animation={batch(Fade(), Sticky(), MoveOut(0, -1650))}>
          <span style={{ fontSize: "2em" }}>"...take care of many of the steps for end-users without the need for expertise in machine learning"</span>
        </Animator>
      </ScrollPage>
    </ScrollContainer>


    <div className="Information">
      {/* <Button className="moreInfo" data={buttonMoreInfo} /> */}
      <ButtonUI style={style} onClick={()=>setClicked(true)} variant="outlined" color="primary" href="#outlined-buttons">
                        Learn More About Ensembled <sup>2</sup>
      </ButtonUI>
    </div>
    </section>
    <br></br>
    <hr style={{"width": "100%"}}></hr>


    <section>
    <div className="Comparison">
      <h1 className="title">Why Ensembled<sup>2</sup>?</h1>
      {/* <div className="Buttons">
      <GraphButton data={accuracy}/>
      <GraphButton data={rank}/>
      <GraphButton data={first}/>
      </div> */}
      <br></br>
      <div id="graph">
      <Graph id="default1" data={accuracy}/>
      <Graph id="default2" data={rank}/>
      <Graph id="default3" data={first}/>
      </div>
    </div>
    </section>
    <br></br>
    <hr style={{"width": "100%"}}></hr>

    <section>
    <footer className="copywrite">&copy; Copyright, University of British Columbia, 2021</footer>
              <br></br>
    </section>
    </div>
  );
}