import React from 'react';
import { useState } from 'react';
import { send } from 'emailjs-com';
import Button from '@material-ui/core/Button';
import "../common/Button.css";
import {contactus_user, contactus_service_id, contactus_template_id} from "../common";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import "../common/Button.css";


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },

    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function ContactUs() {
  const classes = useStyles();

  const [toSend, setToSend] = useState({
    from_name: "",
    subject: "",
    message: "",
    email: "",
  });
  
  const onSubmit = (e) => {
    e.preventDefault();
    send(
      contactus_service_id,
      contactus_template_id,
      toSend,
      contactus_user
    )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setToSend({
          from_name: "",
          subject: "",
          message: "",
          email: "",
        });
        alert("Your enquiry has been sent!");
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });
  };

  const handleChange = (e) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <div style={{paddingTop: "3vh", paddingBottom: "3vh", textAlign: "center"}}>
    <h1><u>Contact Us</u></h1>
    <p>We are looking forward to read your email! <br/> 
      Please fill out the form below, and our team will get back to you in 1-3 business days.</p>
    <form onSubmit={onSubmit} className={classes.root} noValidate>
      <TextField name="from_name" validate="required:true" value={toSend.from_name} onChange={handleChange}
            type="text"
            id="standard-textarea"
            label="Name"
            variant="filled" 
            placeholder="Please enter your name"
            required
      />
      <br/>
      <TextField TextMode="Email" name="email"
            pattern="[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*"
            value={toSend.email} onChange={handleChange}
            type="email"
            id="standard-textarea"
            label="Email"
            variant="filled" 
            placeholder="Please enter your Email"
            required
      />
      <br/>
      <TextField name="subject" value={toSend.subject} onChange={handleChange}
            type="text"
            id="standard-textarea"
            label="Subject"
            variant="filled" 
            placeholder="Subject"
      />
      <br/>
      <TextField style={{width: "40vw"}} name="message" 
          value={toSend.message} onChange={handleChange}
            type="text"
            id="filled-textarea"
            label="Message"
            placeholder="Your message"
            multiline
            rows={7}
            variant="filled"
            required
      />
      <br/>
      <Button className="CutomSubmitContact" type="submit" value="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
    </div>
  );
}