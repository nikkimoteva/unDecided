import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import "../Common/Button.css";
import {useAuth} from "./Auth";
import {useHistory} from "react-router-dom";
import {useLoginModalContext} from "./LoginModalProvider";


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

  const auth = useAuth();
  const history = useHistory();
  const {loginModal, setLoginModal} = useLoginModalContext();


  const classes = useStyles();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    //confirm password
    cpass: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    cpass: "",
  });

  function handleChanges(event) {
    setUser({
      ...user, 
      [event.target.name]: event.target.value
    });
  }

  function handleSubmits(event) {
    event.preventDefault();

    if (validate()) {
      auth.signup(user.name, user.email, user.password)
      .then ((res) => {
        if (res.status === 400) {
          alert("Error in signing up. Please try again.");
        } else if (res.data.error) {
          alert(res.data.error);
        } else {
          setLoginModal(false);
          history.push('/console');
          console.log("successfully logged in");
          setUser( {
            name: "",
            email: "",
            password: "",
            cpass: "",
          });
        }
      })
      .catch ((err) => {
        console.log ("FAILED...", err);
      });
    }
  }

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

    if (!user.cpass) {
      isValid = false;
      errors["cpass"] = "Please re-enter your password.";
    }

    if (user.password && user.cpass && user.password !== user.cpass) {
      isValid = false;
      errors["cpass"] = "The passwords do not match.";
    }

    setError({
      name: errors["name"],
      email: errors["email"],
      password: errors["password"],
      cpass: errors["cpass"]
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
            label="Name"
            variant="filled"
            placeholder="Please enter your name"
          />

          <div style={{color: "#f50057"}}>{error.name}</div>
        </div>

        <div className="form-group">
          <TextField
            type="text"
            name="email"
            value={user.email}
            onChange={handleChanges}
            label="Email"
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
            placeholder="At least 8 characters"
            type="password"
            label="Password"
            variant="filled"
          />
          <div style={{color: "#f50057"}}>{error.password}</div>
        </div>

        <div className="form-group">
          <TextField
            name="cpass"
            value={user.cpass}
            onChange={handleChanges}
            placeholder="Please re-enter your password"
            type="password"
            label="Confirm Password"
            variant="filled"
          />
          <div style={{color: "#f50057"}}>{error.cpass}</div>
        </div>

        <Button className="CustomSubmitAuth" type="submit" value="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
}
