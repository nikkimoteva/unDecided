import React from 'react';
import { useState } from 'react';
import { send } from 'emailjs-com';
import Button from '@material-ui/core/Button';
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
  const [input, setInput] = useState({
    from_name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [error, setError] = useState({
    from_name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [toSend, setToSend] = useState({
    from_name: "",
    subject: "",
    message: "",
    email: "",
  });

  function handleChange(event) {
    setInput({
      ...input, 
      [event.target.name]: event.target.value
    });

    setToSend({ ...toSend, [event.target.name]: event.target.value });
    console.log(input);
    console.log(toSend);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validate()) {
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

      setToSend({
        from_name: "",
        subject: "",
        message: "",
        email: "",
      });
    }
  }
  

  const handleChanges = handleChange.bind(this);
  const handleSubmits = handleSubmit.bind(this);

  function validate() {
    const errors = {};
    let isValid = true;
    console.log(1);

    if (!input.from_name) {
      console.log(2);
      isValid = false;
      errors["from_name"] = "Please enter your name.";
    }

    if (!input.email) {
      console.log(3);
      isValid = false;
      errors["email"] = "Please enter your email address.";
    }

    if (typeof input.email !== "undefined") {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(input["email"])) {
        console.log(4);
        isValid = false;
        errors["email"] = "Please enter a valid email address.";
      }
    }

    if (!input.message) {
      console.log(5);
      isValid = false;
      errors["message"] = "Please enter your message.";
    }

    setError({
      from_name: errors["from_name"],
      email: errors["email"],
      message: errors["message"]
    });

    return isValid;
  }

  return (
    <div
      style={{ paddingTop: "3vh", paddingBottom: "3vh", textAlign: "center" }}
    >
      <h1>
        <u>Contact Us</u>
      </h1>
      <p>
        We are looking forward to read your email! <br />
        Please fill out the form below, and our team will get back to you in 1-3
        business days.
      </p>
      <form onSubmit={handleSubmits} className={classes.root}>
        <div className="form-group">
          <TextField
            type="text"
            name="from_name"
            value={input.from_name}
            onChange={handleChanges}
            label="Name"
            variant="filled"
            placeholder="Please enter your name"
          />

          <div className="text-danger">{error.from_name}</div>
        </div>
        <br />

        <div className="form-group">
          <TextField
            type="text"
            name="email"
            value={input.email}
            onChange={handleChanges}
            label="Email"
            variant="filled"
            placeholder="Please enter your Email"
          />
          <div className="text-danger">{error.email}</div>
        </div>
        <br />

        <div className="form-group">
          <TextField
            name="subject"
            value={input.subject}
            onChange={handleChanges}
            placeholder="Enter subject"
            type="text"
            label="Subject"
            variant="filled"
          />
        </div>
        <br />

        <div className="form-group">
          <TextField
            style={{ width: "40vw" }}
            name="message"
            value={input.message}
            onChange={handleChanges}
            placeholder="Enter message"
            type="text"
            label="Message"
            multiline
            rows={7}
            variant="filled"
          />
          <div className="text-danger">{error.message}</div>
        </div>
        <br />

        <Button className="CutomSubmitContact" type="submit" value="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
}
