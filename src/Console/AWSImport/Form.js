import {useState} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";

export default function AWSImportForm(props) {
  const [region, setRegion] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");

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
    <FormControl style={{display: "flex"}}>
      <InputLabel id="region-select">S3 Bucket Region</InputLabel>
      <Select id="region-select" value={region} onChange={handleRegionChange} margin="normal">
        {regions.map(region => (
          <MenuItem key={region} value={region}>{region}</MenuItem>
        ))}
      </Select>
      <TextField
        value={accessKey}
        onChange={handleAccessKeyChange}
        label="Access Key"
        margin="normal"
      />
      <TextField
        margin="normal"
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
  );
}
