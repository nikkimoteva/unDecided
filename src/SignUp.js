import React from 'react';
import {borders} from '@material-ui/system';
import {TextField} from "@material-ui/core"
import {Button} from "@material-ui/core"
import {withStyles} from '@material-ui/styles';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Header from "./Header";
import { useState } from 'react';


// TODO:
// password validation
// name validation
// email validation

const styles = () => ({


  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '50ch',

  },
  textField: {
    width: '25ch',
  },
  longTextField: {
    width: '50ch',
  },

});

export default function Signup() {

  const [formDetail, setFormDetail] = useState({firstName: '', lastName: '', email: "", password: "", users: []});

  const TextFieldOnChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    setFormDetail((prevState) => ({
       ...prevState,
       [nam]: val
    }))

  }

  const submitHandler = (event) => {
    event.preventDefault();
    let temp = formDetail.users
    temp.push({
      firstName: formDetail.firstName,
      lastName: formDetail.lastName,
      email: formDetail.email,
      password: formDetail.password,
    })
    setFormDetail((prevState) => ({
       ...prevState,
       users: temp
    }))

  }

  const classes = styles();

  return (
      <>
        // <Header handleLogin={classes.handleLogin}/> {/*Does not work yet*/}
        <form className={classes.root} noValidate autoComplete="on">
          <div>
            <TextField name="firstName"
                       label="First Name"
                       variant="outlined"
                       className={classes.textField}
                       onChange={TextFieldOnChange}
            />
            <TextField name="lastName"
                       label="Last Name"
                       variant="outlined"
                       className={classes.textField}
                       onChange={TextFieldOnChange}
            />
          </div>
          <div>
            <TextField name="email"
                       label="Email"
                       variant="outlined"
                       className={classes.longTextField}
                       onChange={TextFieldOnChange}

            />
          </div>
          <div>
            <TextField name="password"
                       label="Password"
                       variant="outlined"
                       type="password"
                       className={classes.textField}
                       onChange={TextFieldOnChange}
            />
            <TextField name="confirm"
                       label="Confirm"
                       variant="outlined"
                       type="password"
            />
          </div>
          <Button type="submit"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={submitHandler}
                  >
            Sign Up!
          </Button>
        </form>
      </>

    );
}

