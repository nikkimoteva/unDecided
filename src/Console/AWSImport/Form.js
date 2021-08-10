import {useState} from "react";
import {Button, MenuItem, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  formDiv: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    margin: "20px"
  },
  formElem: {
    width: "300px",
    margin: "0 20px"
  }
}));

export default function AWSImportForm(props) {
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const classes = useStyles();

  function handleAccessKeyChange(event) {
    setAccessKey(event.target.value);
  }

  function handleSecretKeyChange(event) {
    setSecretKey(event.target.value);
  }

  function clear() {
    setAccessKey("");
    setSecretKey("");
  }

  return (
    <form>
      <div className={classes.formDiv}>
        <TextField
          value={accessKey}
          onChange={handleAccessKeyChange}
          label="Access Key"
          className={classes.formElem}
        />
        <TextField
          value={secretKey}
          onChange={handleSecretKeyChange}
          label="Secret Key"
          type="password"
          className={classes.formElem}
        />
      </div>

      <div className={classes.formDiv}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {props.onSubmit(accessKey, secretKey); clear(); alert("Successfully added!");}}
          disabled={accessKey === "" || secretKey === ""}
          className={classes.formElem}
        >
          Use Credentials
        </Button>
      </div>
    </form>
  );
}
