import React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import LoginModal from "./LoginModal";
import {useAuth} from "./Auth";
import {useHistory} from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import {useLoginModalContext} from "./LoginModalProvider";
import "../Common/Button.css";


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

export default function SignIn() {
  const classes = useStyles();

  const auth = useAuth();
  const history = useHistory();
  const {loginModal, setLoginModal} = useLoginModalContext();

  //google auth
  function login(credentials) {
    auth.signinGoogle(credentials)
      .then(() => {
        setLoginModal(false);
        history.push('/console');
      });
  }

  // self auth
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
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
      auth.signin(user.email, user.password)
      .then ((res) => {
        if (res) {
          setLoginModal(false);
          history.push('/console');
          console.log("successfully logged in");
          setUser( {
            email: "",
            password: "",
          });
        } else {
          alert("Email or password is incorrect. Please try again.");
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
      errors["password"] = "Please enter your password.";
    }

    setError({
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
            placeholder="Please enter your password"
            type="password"
            label="Password"
            variant="filled"
          />
          <div style={{color: "#f50057"}}>{error.password}</div>
        </div>
        <Button className="CustomSubmitAuth" type="submit" value="submit" variant="contained" color="primary">
          Submit
        </Button>
          <Divider/>
        <LoginModal signin={login} />
      </form>
    </div>
  );
}
