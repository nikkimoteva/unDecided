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

const regions = [
  'us-east-2',
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'af-south-1',
  'ap-east-1',
  'ap-northeast-3',
  'ap-northeast-2',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ca-central-1',
  'cn-north-1',
  'cn-northwest-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-south-1',
  'eu-west-3',
  'eu-north-1',
  'me-south-1',
  'sa-east-1'
];

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
          onClick={() => props.onSubmit(accessKey, secretKey)}
          disabled={accessKey === "" || secretKey === ""}
          className={classes.formElem}
        >
          Use Credentials
        </Button>
      </div>
    </form>
  );
}
