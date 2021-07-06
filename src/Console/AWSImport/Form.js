import {useState} from "react";
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  root_div: {
    display: "block",
    textAlign: "center"
  },
  root: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "5vh",
    marginBottom: "1vh",
    textAlign: "center",
    display: "inline-block"
  },
  submitButton: {
    margin: 0,
    position: "absolute",
    top: "50%",
    left: "50%",
    msTransform: "translate(-50%, -50%)",
    transform: "translate(-50%, -50%)"
  }
});


export default function AWSImportForm(props) {
  const [region, setRegion] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const classes = useStyles();

  function handleRegionChange(event) {
    setRegion(event.target.value);
  }

  function handleAccessKeyChange(event) {
    setAccessKey(event.target.value);
  }

  function handleSecretKeyChange(event) {
    setSecretKey(event.target.value);
  }

  return (
    <div className={classes.root_div}>
      <FormControl className={classes.root}>
        <InputLabel id="region-select">S3 Bucket Region</InputLabel>
        <Select id="region-select" value={region} onChange={handleRegionChange}>
          <MenuItem value={'us-east-2'} key="us-east-2"/>
          <MenuItem value={'us-east-1'}>us-east-1</MenuItem>
          <MenuItem value={'us-west-1'}>us-west-1</MenuItem>
          <MenuItem value={'us-west-2'}>us-west-2</MenuItem>
          <MenuItem value={'af-south-1'}>af-south-1</MenuItem>
          <MenuItem value={'ap-east-1'}>ap-east-1</MenuItem>
          <MenuItem value={'ap-south-1'}>ap-south-1</MenuItem>
          <MenuItem value={'ap-northeast-3'}>ap-northeast-3</MenuItem>
          <MenuItem value={'ap-northeast-2'}>ap-northeast-2</MenuItem>
          <MenuItem value={'ap-southeast-1'}>ap-southeast-1</MenuItem>
          <MenuItem value={'ap-southeast-2'}>ap-southeast-2</MenuItem>
          <MenuItem value={'ap-northeast-1'}>ap-northeast-1</MenuItem>
          <MenuItem value={'ca-central-1'}>ca-central-1</MenuItem>
          <MenuItem value={'cn-north-1'}>cn-north-1</MenuItem>
          <MenuItem value={'cn-northwest-1'}>cn-northwest-1</MenuItem>
          <MenuItem value={'eu-central-1'}>eu-central-1</MenuItem>
          <MenuItem value={'eu-west-1'}>eu-west-1</MenuItem>
          <MenuItem value={'eu-west-2'}>eu-west-2</MenuItem>
          <MenuItem value={'eu-south-1'}>eu-south-1</MenuItem>
          <MenuItem value={'eu-west-3'}>eu-west-3</MenuItem>
          <MenuItem value={'eu-north-1'}>eu-north-1</MenuItem>
          <MenuItem value={'me-south-1'}>me-south-1</MenuItem>
          <MenuItem value={'sa-east-1'}>sa-east-1</MenuItem>
        </Select>
        <TextField
          value={accessKey}
          onChange={handleAccessKeyChange}
          label="Access Key"
        />
        <TextField
          value={secretKey}
          onChange={handleSecretKeyChange}
          label="Secret Key"
          type="password"
        />
        <Button type="submit"
                variant="outlined"
                color="primary"
                onClick={() => props.onSubmit(region, accessKey, secretKey)}
                disabled={region === "" || accessKey === "" || secretKey === ""}
        >
          Use credentials
        </Button>
      </FormControl>
    </div>
  );
}
