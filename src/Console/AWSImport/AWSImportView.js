import {registerAWS, listBuckets, listObjects, getObject} from "../../common/Managers/EndpointManager";
import {useState} from "react";
import {DataGrid} from "@material-ui/data-grid";
import "./AWSImport.css";
import AWSImportForm from "./Form";
import {DialogContent, makeStyles, TextField, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dataGridDiv: {
    height: "400px",
    width: '100%'
  }
}));

export default function AWSImportView(props) {
  const [rows, setRows] = useState([]);
  const [rowsToShow, setRowsToShow] = useState([]);
  const [currBucket, setCurrBucket] = useState("");
  const [showBucketsTable, setShowBucketsTable] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const classes = useStyles();

  const objectTableFields = [
    {field: 'Key', headerName: 'Key', width: 300},
    {field: 'Owner', headerName: 'Owner', width: 300},
    {field: 'LastModified', headerName: 'Last Modified', width: 300},
    {field: 'Size', headerName: 'Size (in MiB)', width: 300}
  ];

  const bucketsTableFields = [
    {field: 'Name', headerName: 'Name', width: 300},
    {field: "Owner", headerName: "Owner", width: 300},
    {field: "CreationDate", headerName: "Creation Date", width: 300}
  ];

  const tableTitle = (showBucketsTable) ? "Buckets" : currBucket;

  function createRows(rows) {
    return rows.map((row, index) => {
      return {id: index, ...row};
    });
  }

  function onSearchChange(event) {
    const newSearch = event.target.value;
    if (newSearch === "") setRowsToShow(rows);
    else if (showBucketsTable) setRowsToShow(rows.filter(row => row.Name.toLowerCase().includes(newSearch.toLowerCase())));
    else setRowsToShow(rows.filter(row => row.Key.toLowerCase().includes(newSearch.toLowerCase())));
  }

  function parseObject(obj) {
    const size = parseFloat(obj.Size);
    let sizeInMiB = size / 1048576.;
    const numDigitsAfterDecimal = (sizeInMiB < 10) ? 1 : 0;
    sizeInMiB = sizeInMiB.toFixed(numDigitsAfterDecimal);
    return {Key: obj.Key, Owner: obj.Owner.DisplayName, LastModified: obj.LastModified, Size: sizeInMiB};
  }

  function registerAndListBuckets(region, accessKey, secretKey) {
    return registerAWS(region, accessKey, secretKey)
      .then(res => {
        setRows([]);
        setLoading(true);
        return listBuckets();
      })
      .then(res => {
        const buckets = (res.Buckets !== undefined) ? res.Buckets : [];
        const owner = res.Owner.DisplayName;
        const bucketJSONs = buckets.map((bucket) => {
          return {Name: bucket.Name, Owner: owner, CreationDate: bucket.CreationDate};
        });
        const rows = createRows(bucketJSONs);
        setRows(rows);
        setRowsToShow(rows);
        setShowBucketsTable(true);
      })
      .catch(err => {
        alert("Unable to get buckets. Check that the provided keys are correct, and that the associated user has S3 Read privileges");
        console.log(err);
      })
      .finally(() => setLoading(false));
  }

  function listObjectsOnClick(params, event) {
    const bucketName = params.row.Name;
    setRowsToShow([]);
    setLoading(true);
    setCurrBucket(bucketName);
    listObjects(bucketName)
      .then(res => {
        const objects = (res !== "") ? res : []; // avoids errors when there are no objects in bucket
        const jsons = objects.map(obj => parseObject(obj));
        const rows = createRows(jsons);
        setRows(rows);
        setRowsToShow(rows);
      })
      .catch(err => {
        console.log(err);
        alert("Failed to retrieve data from objects. Check that the region selected matches the bucket region");
      })
      .finally(() => {
        setLoading(false);
        setShowBucketsTable(false);
      });
  }

  function getObjectOnClick(params, event) {
    const key = params.row.Key;
    if (key.slice(-4) !== ".csv") {
      alert("File object must have a '.csv' extension");
    } else {
      setLoading(true);
      setRowsToShow([]);
      getObject(currBucket, key)
        .then(csvString => {
          console.log("Retrieved file");
          props.updateCSVState(csvString);
        })
        .catch(err => {
          console.log(err);
          alert("Failed to retrieve file from S3");
          props.setDataImportSuccess(false);
        })
        .finally(() => {
          setLoading(false);
          props.closeModal();
          console.log("error here i think");
        });
    }
  }

  return (
    <DialogContent>
      <AWSImportForm onSubmit={registerAndListBuckets}/>
      <br/><br/>
      <Typography variant="h4" style={{textAlign: "center", marginBottom: "20px"}}>{tableTitle}</Typography>
      <div style={{display: "flex", justifyContent: "end"}}>
        <TextField onChange={onSearchChange} label="Search" type="search"/>
      </div>
      <div className={classes.dataGridDiv} hidden={!showBucketsTable}>
        <CustomDataGrid rows={rowsToShow} columns={bucketsTableFields} doubleClick={listObjectsOnClick}
                        loading={isLoading}
        />
      </div>
      <div className={classes.dataGridDiv} hidden={showBucketsTable}>
        <CustomDataGrid rows={rowsToShow} columns={objectTableFields} doubleClick={getObjectOnClick}
                        loading={isLoading}
        />
      </div>
    </DialogContent>
  );
}

function CustomDataGrid(props) {
  return <DataGrid rows={props.rows}
                   columns={props.columns}
                   pageSize={10}
                   onCellDoubleClick={props.doubleClick}
                   columnBuffer={2}
                   loading={props.loading}
         />;
}
