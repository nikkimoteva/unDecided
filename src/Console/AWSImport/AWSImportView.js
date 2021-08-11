import {registerAWS, listBuckets as listBucketsDB, listObjects, getObject, getAWSCred} from "../../Common/Managers/EndpointManager";
import React, {useContext, useState} from "react";
import {DataGrid} from "@material-ui/data-grid";
import KeyboardReturnIcon from '@material-ui/icons/KeyboardReturn';
import "./AWSImport.css";
import {DialogContent, TextField, Typography} from "@material-ui/core";
import {CloseModalContext} from "../JobForms/Components/FileUploadComponent";
import {getAuthCookie} from "../../Common/Managers/CookieManager";
import Button from "@material-ui/core/Button";
import {MenuItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const objectTableFields = [
  {field: 'Key', headerName: 'Key', flex: 1},
  {field: 'Owner', headerName: 'Owner', flex: 1},
  {field: 'LastModified', headerName: 'Last Modified', flex: 1},
  {field: 'Size', headerName: 'Size (in MiB)', flex: 1}
];

const bucketsTableFields = [
  {field: 'Name', headerName: 'Name', flex: 1},
  {field: "Owner", headerName: "Owner", flex: 1},
  {field: "CreationDate", headerName: "Creation Date", flex: 1}
];

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

const useStyles = makeStyles(() => ({
  formDiv: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    margin: "0 auto"
  },
  formElem: {
    width: "300px",
    margin: "0 20px"
  }
}));


export default function AWSImportView(props) {
  const [rows, setRows] = useState([]);
  const [rowsToShow, setRowsToShow] = useState([]);
  const [currBucket, setCurrBucket] = useState("");
  const [tableFields, setTableFields] = useState([]);
  const [showBucketsTable, setShowBucketsTable] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [region, setRegion] = useState("");

  const closeModal = useContext(CloseModalContext);

  const tableTitle = (showBucketsTable) ? "Buckets" : currBucket;

  const classes = useStyles();

  function handleRegionChange(event) {
    setRegion(event.target.value);
    registerAndListBuckets(event.target.value);
  }

  function onSearchChange(event) {
    const newSearch = event.target.value;
    if (newSearch === "") setRowsToShow(rows);
    else if (showBucketsTable) setRowsToShow(rows.filter(row => row.Name.toLowerCase().includes(newSearch.toLowerCase())));
    else setRowsToShow(rows.filter(row => row.Key.toLowerCase().includes(newSearch.toLowerCase())));
  }

  function getBucketRows(buckets, owner) {
    return buckets.map((bucket, ind) => {
      return {id: ind, Name: bucket.Name, Owner: owner, CreationDate: bucket.CreationDate};
    });
  }

  function updateRows(newRows) {
    setRows(newRows);
    setRowsToShow(newRows);
  }

  function getObjectRows(arr) {
    return arr.map((obj, ind) => {
      const size = parseFloat(obj.Size);
      const sizeInMiB = (size / 1048576.).toPrecision(3);
      return {id: ind, Key: obj.Key, Owner: obj.Owner.DisplayName, LastModified: obj.LastModified, Size: sizeInMiB};
    });
  }

  function registerAndListBuckets(region) {
    const cookie = getAuthCookie();
    return getAWSCred(cookie.email)
      .then((res) => {
        return registerAWS(region, res.data.access, res.data.secret);
      })
      .then(() => {
        updateRows([]);
        setIsLoadingList(true);
        return listBucketsDB();
      })
      .then(res => {
        const buckets = (res.Buckets !== undefined) ? res.Buckets : [];
        const owner = res.Owner.DisplayName;
        const rows = getBucketRows(buckets, owner);
        setTableFields(bucketsTableFields);
        setShowBucketsTable(true);
        updateRows(rows);
      })
      .catch(err => {
        alert("Unable to get buckets. Check that the user has S3 Read privileges and the S3 credentials are correct.");
        console.log(err);
      })
      .finally(() => setIsLoadingList(false));
  }

  function listObjectsOnClick(params, event) {
    const bucketName = params.row.Name;
    updateRows([]);
    setCurrBucket(bucketName);
    setIsLoadingList(true);
    listObjects(bucketName)
      .then(res => {
        const objects = (res !== "") ? res : [];
        const rows = getObjectRows(objects);
        setTableFields(objectTableFields);
        updateRows(rows);
      })
      .catch(err => {
        alert("Failed to retrieve data from objects. Check that the region selected matches the bucket region");
        console.log(err);
      })
      .finally(() => {
        setIsLoadingList(false);
        setShowBucketsTable(false);
      });
  }

  function getObjectOnClick(params, event) {
    const key = params.row.Key;
    if (key.slice(-4) !== ".csv") {
      alert("File object must have a '.csv' extension");
    } else {
      props.setIsLoadingFile(true);
      props.setProgressBarType('indeterminate');
      closeModal();

      getObject(currBucket, key)
        .then(csvString => {
          props.updateCSVState(csvString);
        })
        .catch(err => {
          console.log(err);
          alert("Failed to retrieve file from S3");
          props.setDataImportSuccess(false);
        })
        .finally(() => {
          props.setIsLoadingFile(false);
          updateRows([]);
        });
    }
  }

  function onDoubleClick(params, event) {
    return (showBucketsTable) ? listObjectsOnClick(params, event) : getObjectOnClick(params, event);
  }

  return (
    <DialogContent style={{height: "100vh"}}>
      <Typography variant="h4" style={{textAlign: "center", marginBottom: "20px"}}>{tableTitle}</Typography>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <Button variant="outlined" onClick={() => registerAndListBuckets(region)} disabled={showBucketsTable}>
          <KeyboardReturnIcon/>
        </Button>
        <TextField
        select
        className={classes.formElem}
        id="region-select"
        value={region}
        onChange={handleRegionChange}
        label="S3 Bucket Region"
        style = {{textAlign: "center"}}
        >
        {
          regions.map(region => <MenuItem key={region} value={region}>{region}</MenuItem>)
        }
      </TextField>
        <TextField onChange={onSearchChange} label="Search" type="search"/>
      </div>
      <div style={{display: "flex", height: "100%"}}>
        <div style={{flexGrow: 1}}>
          <DataGrid rows={rowsToShow}
                    columns={tableFields}
                    pageSize={10}
                    onCellDoubleClick={onDoubleClick}
                    columnBuffer={2}
                    loading={isLoadingList}
          />
        </div>
      </div>
    </DialogContent>
  );
}
