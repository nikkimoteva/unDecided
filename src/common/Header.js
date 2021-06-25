import logo from '../logo.png';
import "../App.css";
import {AppBar, Button, ButtonGroup} from "@material-ui/core";
import {Link} from "react-router-dom";

export default function Header(props) {
  return (
    <AppBar position="static">
      <div style={{float: "left"}}>
        <Link to="/">
          {/* <img src={logo} className="logo" alt="logo"/> */}
        </Link>
      </div>
      <div style={{float: "right"}}>
        <ButtonGroup color="secondary">
          <Button variant="contained" component={Link} to="/docs">Docs</Button>
          <Button variant="contained" component={Link} to="/demo">Demo</Button>
          <Button variant="contained" onClick={props.openLogin}>Log In</Button>
          <Button variant="contained" component={Link} to="/signup">Sign Up</Button>
        </ButtonGroup>
      </div>
    </AppBar>
  )
}
