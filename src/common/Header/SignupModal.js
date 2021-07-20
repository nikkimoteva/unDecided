import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import "../Button.css";


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

export default function Signup() {
  const classes = useStyles();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    setUser({
      ...user, 
      [event.target.name]: event.target.value
    });

    // setToSend({ ...toSend, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validate()) {
        // make call to userauth.js
        // redirect to login / auto login
    //   send(
    //     contactus_service_id,
    //     contactus_template_id,
    //     toSend,
    //     contactus_user
    //   )
    //     .then((response) => {
    //       console.log("SUCCESS!", response.status, response.text);
    //       setUser({
    //         name: "",
    //         email: "",
    //         password: "",
    //       });
    //       alert("Please login to access your account!");
    //     })
    //     .catch((err) => {
    //       console.log("FAILED...", err);
    //     });
    }
  }
  

  const handleChanges = handleChange.bind(this);
  const handleSubmits = handleSubmit.bind(this);

  function validate() {
    const errors = {};
    let isValid = true;

    if (!user.name) {
      isValid = false;
      errors["name"] = "Please enter your name";
    }

    if (!user.email) {
      isValid = false;
      errors["email"] = "Please enter your email address.";
    }

    if (typeof user.email !== "undefined") {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(user["email"])) {
        isValid = false;
        errors["email"] = "Please enter a valid email address.";
      }
    }

    if (!user.password) {
      isValid = false;
      errors["password"] = "Please enter a password.";
    }

    if (user.password && user.password.length < 8) {
        isValid = false;
        errors["password"] = "The password should be at least 8 characters long.";
    }

    setError({
      name: errors["name"],
      email: errors["email"],
      password: errors["password"]
    });

    return isValid;
  }

  return (
    <div>
      <form onSubmit={handleSubmits} className={classes.root}>
        <div className="form-group">
          <TextField
            type="text"
            name="name"
            value={user.name}
            onChange={handleChanges}
            label="Name (*required)"
            variant="filled"
            placeholder="Please enter your name."
          />

          <div style={{color: "#f50057"}}>{error.name}</div>
        </div>

        <div className="form-group">
          <TextField
            type="text"
            name="email"
            value={user.email}
            onChange={handleChanges}
            label="Email (*required)"
            variant="filled"
            placeholder="Please enter your Email"
          />
          <div style={{color: "#f50057"}}>{error.email}</div>
        </div>

        <div className="form-group">
          <TextField
            name="password"
            value={user.password}
            onChange={handleChanges}
            placeholder="At least 8 characters."
            type="text"
            label="Password (*required)"
            variant="filled"
          />
          <div style={{color: "#f50057"}}>{error.password}</div>
        </div>

        <Button className="CutomSubmitAuth" type="submit" value="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
}
