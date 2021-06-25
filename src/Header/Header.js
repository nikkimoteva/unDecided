import logo from '../logo.png';
import "../App.css";
import {AppBar, Button, ButtonGroup, Modal, Toolbar} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../Auth/Auth";
import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Profile from "./Profile";
import LoginModal from "./LoginModal";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
  },
}));

export default function Header() {
  const classes = useStyles();
  const [loginModal, setLoginModal] = useState(false);

  const auth = useAuth();
  const history = useHistory();

  function openLoginModal() {
    setLoginModal(true);
  }

  function closeLoginModal() {
    setLoginModal(false);
  }

  function login(credentials) {
    auth.signin(credentials)
      .then(() => {
        history.push('/console');
      })
  }

  function logout() {
    auth.signout();
    history.push('/') // redirect to main page
  }


  const headerButtons = (auth.user == null) // allow type coercion to catch undefined as well
    ? (
      <ButtonGroup color="secondary">
        <Button variant="contained" component={Link} to="/docs">Docs</Button>
        <Button variant="contained" component={Link} to="/demo">Demo</Button>
        <Button variant="contained" onClick={openLoginModal}>Sign In</Button>
      </ButtonGroup>
    )
    : (
      <ButtonGroup color="secondary">
        <Button variant="contained" component={Link} to="/docs">Docs</Button>
        <Button variant="contained" component={Link} to="/console">Dashboard</Button>
        <Button variant="contained" component={Link} to="/console/jobs">Jobs</Button>
        <Profile signout={logout}/>
      </ButtonGroup>
    )

  return (
    <>
      <AppBar position="static">
        <div className={classes.logo}>
          <Link to="/">
            <img src={logo} className="logo" alt="logo"/>
          </Link>
        </div>
        {headerButtons}
      </AppBar>

      <Modal
        open={loginModal}
        onClose={closeLoginModal}
        aria-labelledby="Login Form"
        aria-describedby="Input your login details here"
      >
        <LoginModal signin={login} onClose={closeLoginModal}/>
      </Modal>
    </>
  )
}

