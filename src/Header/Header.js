import logo from '../logo.png';
import "../App.css";
import {AppBar, Button, ButtonGroup, Modal} from "@material-ui/core";
import {Link} from "react-router-dom";
import {useAuth} from "../Auth/Auth";
import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Profile from "./Profile";
import LoginModal from "./LoginModal";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function SignedOutButtons(props) {
  return <ButtonGroup color="secondary">
    <Button variant="contained" component={Link} to="/docs">Docs</Button>
    <Button variant="contained" component={Link} to="/demo">Demo</Button>
    <Button variant="contained" onClick={props.openLoginModal}>Sign In</Button>
  </ButtonGroup>
}

function SignedInButtons() {
  const auth = useAuth();

  return <ButtonGroup color="secondary">
    <Button variant="contained" component={Link} to="/docs">Docs</Button>
    <Button variant="contained" component={Link} to="/console">Dashboard</Button>
    <Button variant="contained" component={Link} to="/console/jobs">Jobs</Button>
    <Profile signout={auth.signout}/>
  </ButtonGroup>
}
export default function Header() {
  const [loginModal, setLoginModal] = useState(false);

  function openLoginModal() {
    setLoginModal(true);
  }

  function closeLoginModal() {
    setLoginModal(false);
  }

  const auth = useAuth();

  return (
    <>
      <AppBar position="static">
        <div style={{float: "left"}}>
          <Link to="/">
            <img src={logo} className="logo" alt="logo"/>
          </Link>
        </div>
        <div style={{float: "right"}}>
          {auth.user == null
          ? <SignedOutButtons openLoginModal={openLoginModal}/>
          : <SignedInButtons/>
          }
        </div>
      </AppBar>

      <Modal
        open={loginModal}
        onClose={closeLoginModal}
        aria-labelledby="Login Form"
        aria-describedby="Input your login details here"
      >
        <LoginModal signin={auth.signin}/>
      </Modal>
    </>
  )
}

