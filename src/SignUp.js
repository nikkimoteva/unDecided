import React from 'react';
import {borders} from '@material-ui/system';
import {TextField} from "@material-ui/core"
import {Button} from "@material-ui/core"
import {withStyles} from '@material-ui/styles';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Header from "./Header";

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

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {firstName: '', lastName: '', email: "", password: "", users: []};
  }

  submitHandler = (event) => {
    event.preventDefault();
    let temp = this.state.users
    temp.push({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    })
    this.setState({users: temp});
    console.log(this.state.users)
  }

  TextFieldOnChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  render() {

    const TextFieldMargin = 4;
    const {classes} = this.props;
    return (
      <>
        <Header handleLogin={classes.handleLogin}/> {/*Does not work yet*/}
        <form className={classes.root} noValidate autoComplete="on">
          <div>
            <TextField name="firstName"
                       label="First Name"
                       variant="outlined"
                       className={classes.textField}
                       onChange={this.TextFieldOnChange}
            />
            <TextField name="lastName"
                       label="Last Name"
                       variant="outlined"
                       className={classes.textField}
                       onChange={this.TextFieldOnChange}
            />
          </div>
          <div>
            <TextField name="email"
                       label="Email"
                       variant="outlined"
                       className={classes.longTextField}
                       onChange={this.TextFieldOnChange}

            />
          </div>
          <div>
            <TextField name="password"
                       label="Password"
                       variant="outlined"
                       type="password"
                       className={classes.textField}
                       onChange={this.TextFieldOnChange}
            />
            <TextField name="confirm"
                       label="Confirm"
                       variant="outlined"
                       type="password"
                       className={classes.textField}
            />
          </div>
          <Button type="submit"
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={this.submitHandler}>
            Sign Up!
          </Button>
        </form>
      </>

    )
  }
}

export default withStyles(styles)(SignUp);
