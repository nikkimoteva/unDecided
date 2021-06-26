import logo from '../../cropped_logo.png';
import {AppBar, Button, ButtonGroup, Modal, Toolbar} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../Auth";
import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Profile from "./Profile";
import LoginModal from "./LoginModal";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    width: "50px",
    marginTop: "12px",
    marginBottom: "12px"
  },
  toolbarButtons: {
    marginLeft: 'auto'
  }
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
      });
  }

  function logout() {
    auth.signout();
    history.push('/'); // redirect to main page
  }

  /*eslint-disable no-implicit-coercion, eqeqeq*/
  const headerButtons = (auth.user == null)
    ? (
      <ButtonGroup variant="text" color="inherit" className={classes.toolbarButtons} size="large">
        <Button component={Link} to="/docs">Docs</Button>
        <Button component={Link} to="/demo">Demo</Button>
        <Button onClick={openLoginModal}>Sign In</Button>
      </ButtonGroup>
    )
    : (
      <ButtonGroup variant="text" color="inherit" className={classes.toolbarButtons} size="large">
        <Button component={Link} to="/docs">Docs</Button>
        <Button component={Link} to="/console">Dashboard</Button>
        <Button component={Link} to="/console/jobs">Jobs</Button>
        <Profile signout={logout}/>
      </ButtonGroup>
    )

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <div >
            <Link to="/">
              <img src={logo} className={classes.logo} alt="logo"/>
            </Link>
          </div>
          {headerButtons}
        </Toolbar>
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

