import logo from '../../images/cropped_logo.png';
import {AppBar, Button, ButtonGroup, Dialog, Slide, Toolbar} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../../Authentication/Auth";
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ProfileIcon from "./ProfileIcon";
import {useLoginModalContext} from "../../Authentication/LoginModalProvider";
import AuthOptions from "../../Authentication/AuthOptions";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    width: "70px",
    marginTop: "5px",
    marginBottom: "5px"
  },
  toolbarButtons: {
    marginLeft: 'auto'
  }
}));

const SlideUpTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Header() {
  const classes = useStyles();
  const {loginModal, setLoginModal} = useLoginModalContext();

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
        history.push('/console/jobs');
      });
  }

  function logout() {
    auth.signout();
    history.push('/'); // redirect to main page
  }

  const headerButtons = (auth.user === undefined || auth.user === "")
    ? (
      <ButtonGroup variant="text" color="inherit" className={classes.toolbarButtons} size="large">
      <Button component={Link} to="/contact">Contact Us</Button>
        <Button component={Link} to="/docs">Docs</Button>
        <Button component={Link} to="/demo">Demo</Button>
        <Button onClick={openLoginModal}>Sign In</Button>
      </ButtonGroup>
    )
    : (
      <ButtonGroup variant="text" color="inherit" className={classes.toolbarButtons} size="large">
      <Button component={Link} to="/contact">Contact Us</Button>
        <Button component={Link} to="/docs">Docs</Button>
        <Button component={Link} to="/console/jobs">Jobs</Button>
        <ProfileIcon signout={logout}/>
      </ButtonGroup>
    );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <div>
            <Link to="/">
              <img src={logo} className={classes.logo} alt="logo"/>
            </Link>
          </div>
          {headerButtons}
        </Toolbar>
      </AppBar>

      <Dialog
        open={loginModal}
        onClose={closeLoginModal}
        aria-labelledby="Login Form"
        aria-describedby="Input your login details here"
        TransitionComponent={SlideUpTransition}
      >
      <AuthOptions />
        {/* <DialogTitle>Sign Up</DialogTitle>
        <SignupModal />

        <DialogTitle>Log In</DialogTitle>
        <LoginModal signin={login} onClose={closeLoginModal}/> */}
      </Dialog>
    </>
  );
}
