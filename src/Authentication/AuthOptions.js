import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import SignupModal from "./SignupModal";
import SignInModal from "./SignInModal";
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  container: {
    display: "flex"
  }
}));


export default function AuthOptions() {
  const classes = useStyles();
  const [openSignUp, setOpenSignUp] = React.useState(false);
  const [openLogIn, setOpenLogIn] = React.useState(false);

  const handleClickSignUp = () => {
      if (openLogIn) {
        setOpenSignUp(!openSignUp);
        setOpenLogIn(!openLogIn);
      }
      else {
        setOpenSignUp(!openSignUp);
      }
  };
  const handleClickLogIn = () => {
    if (openSignUp) {
      setOpenSignUp(!openSignUp);
      setOpenLogIn(!openLogIn);
    }
    else {
        setOpenLogIn(!openLogIn);
    }
  };

  return (
    <div className={classes.root}>
      <List>
        <ListItem button onClick={handleClickSignUp}>
          <ListItemText primary="Sign Up" />
          {openSignUp ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
          <Divider/>
        <Collapse in={openSignUp} timeout="auto">
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
                <SignupModal />
            </ListItem>
          </List>
          <Divider/>
        </Collapse>

          <Divider/>

        <ListItem button onClick={handleClickLogIn}>
          <ListItemText primary="Login" />
          {openLogIn ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openLogIn} timeout="auto">
          <Divider/>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
                <SignInModal />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
}
