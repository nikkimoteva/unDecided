import {Button, Table, TextField} from "@material-ui/core";
import {registerAWS, listBuckets, listObjects, getObject} from "../common/Managers/EndpointManager";
import {useState} from "react";
import {DataGrid} from "@material-ui/data-grid";
import "./AWSImportView.css";
import {useHistory} from "react-router-dom";

export default function AWSImportView() {
  const [idPool, setIdPool] = useState("");
  const [rows, setRows] = useState([]);
  // const [columns, setColumns] = useState([]);
  const [currBucket, setCurrBucket] = useState("");
  const [showBucketsTable, setShowBucketsTable] = useState(true);

  const objectTableFields = [
    {field: 'Key', headerName: 'Key', width: 300},
    {field: 'Owner', headerName: 'Owner', width: 300},
    {field: 'LastModified', headerName: 'Last Modified', width: 300},
    {field: 'Size', headerName: 'Size (in MiB)', width: 300}
  ];

  const bucketsTableFields = [
    {field: 'Name', headerName: 'Name', width: 300},
    {field: "CreationDate", headerName: "Creation Date", width: 300}
  ];

  const history = useHistory();

  function handleIdPoolChange(event) {
    setIdPool(event.target.value);
  }

  function createRows(rows) {
    return rows.map((row, index) => {
      return {id: index, ...row};
    });
  }

  function parseObject(obj) {
    const size = parseFloat(obj.Size);
    let sizeInMiB = size / 1048576.;
    if (sizeInMiB < 10) sizeInMiB = sizeInMiB.toFixed(1);
    return {Key: obj.Key, Owner: obj.Owner.DisplayName, LastModified: obj.LastModified, Size: sizeInMiB};
  }

  function registerAndListBuckets(event) {
    event.preventDefault();
    return registerAWS(idPool)
      .then(_ => {
        return listBuckets();
      })
      .then(buckets => {
        const bucketJSONs = buckets.map((bucket) => {
          return {Name: bucket.Name, CreationDate: bucket.CreationDate};
        });
        setRows(createRows(bucketJSONs));
        setShowBucketsTable(true);
      })
      .catch(err => console.log(err));
  }

  function listObjectsOnClick(params, event) {
    const bucketName = params.row.Name;
    setCurrBucket(bucketName);
    listObjects(bucketName)
      .then(objects => {
        console.log(objects);
        const jsons = objects.map(obj => parseObject(obj));
        setRows(createRows(jsons));
        setShowBucketsTable(false);
      })
      .catch(err => console.log(err));
  }

  function getObjectOnClick(params, event) {
    const key = params.row.Key;
    getObject(currBucket, key)
      .then(csvString => {
        console.log(csvString);
        history.push({
          pathname: "/console/submitJob",
          state: {csvString} // can access using props.location.state.csvString
        });
      })
      .catch(err => console.log(err));
  }

  return (
    <>
      <div>
        <form noValidate>
          <TextField
            value={idPool}
            onChange={handleIdPoolChange}
            label="Identity Pool ID"
          />

          <Button type="submit"
                  variant="outlined"
                  color="primary"
                  onClick={registerAndListBuckets}
          >
            Use credentials
          </Button>
        </form>
      </div>

      <div style={{height: 600, width: '100%'}} hidden={!showBucketsTable}>
        <DataTable rows={rows} columns={bucketsTableFields} doubleClick={listObjectsOnClick}/>
      </div>
      <div style={{height: 600, width: '100%'}} hidden={showBucketsTable}>
        <DataTable rows={rows} columns={objectTableFields} doubleClick={getObjectOnClick}/>
      </div>
    </>
  );
}

function DataTable(props) {
  return <DataGrid rows={props.rows}
                   columns={props.columns}
                   pageSize={10}
                   onCellDoubleClick={props.doubleClick}
                   columnBuffer={2}
         />;
}
