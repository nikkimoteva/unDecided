import {Link} from "react-router-dom";
import {Button, TextField} from "@material-ui/core";
import {useState} from "react";


export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submitHandler(event) {
    event.preventDefault();
    // TODO: Send email and password to server and retrieve account data
  }

  function emailHandler(event) {
    setEmail(event.target.value)
  }

  function passwordHandler(event) {
    setPassword(event.target.value);

  }

  return (
    <form noValidate autoComplete="on">
      <TextField id="standard-basic" label="Email" value={email} onChange={emailHandler}/>
      <TextField id="standard-password-input" label="Password" type="password" value={password} onChange={passwordHandler}/>
      <Button type="submit" onClick={submitHandler}>Submit</Button>
      <Button component={Link} to="/signup">Sign Up</Button>
    </form>
  );
}
