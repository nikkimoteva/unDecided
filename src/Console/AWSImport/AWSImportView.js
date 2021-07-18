import {registerAWS, listBuckets, listObjects, getObject} from "../../common/Managers/EndpointManager";
import {useState} from "react";
import {DataGrid} from "@material-ui/data-grid";
import "./AWSImport.css";
import {useHistory} from "react-router-dom";
import AWSImportForm from "./Form";
import {Typography} from "@material-ui/core";


export default function AWSImportView() {
  const [rows, setRows] = useState([]);
  const [currBucket, setCurrBucket] = useState("");
  const [showBucketsTable, setShowBucketsTable] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const history = useHistory();

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

  function parseObject(obj) {
    const size = parseFloat(obj.Size);
    let sizeInMiB = size / 1048576.;
    if (sizeInMiB < 10) sizeInMiB = sizeInMiB.toFixed(1);
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
        const buckets = res.Buckets;
        const owner = res.Owner.DisplayName;
        const bucketJSONs = buckets.map((bucket) => {
          return {Name: bucket.Name, Owner: owner, CreationDate: bucket.CreationDate};
        });
        setRows(createRows(bucketJSONs));
        setShowBucketsTable(true);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }

  function listObjectsOnClick(params, event) {
    const bucketName = params.row.Name;
    setRows([]);
    setLoading(true);
    setCurrBucket(bucketName);
    listObjects(bucketName)
      .then(objects => {
        const jsons = objects.map(obj => parseObject(obj));
        setRows(createRows(jsons));
        setShowBucketsTable(false);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }

  function getObjectOnClick(params, event) {
    const key = params.row.Key;
    if (key.slice(-4) !== ".csv") {
      alert("File object must have a '.csv' extension");
    } else {
      getObject(currBucket, key)
        .then(csv => {
          console.log("Retrieved file");
          history.push({
            pathname: "/console/submitJob",
            state: {csv} // can access using history.location.state.csv
          });
        })
        .catch(err => console.log(err));
    }
  }

  return (
    <div>
      <AWSImportForm onSubmit={registerAndListBuckets}/>
      <Typography variant="h4" style={{textAlign: "center", marginBottom: "20px"}}>{tableTitle}</Typography>
      <div style={{height: 600, width: '100%'}} hidden={!showBucketsTable}>
        <DataTable rows={rows} columns={bucketsTableFields} doubleClick={listObjectsOnClick} loading={isLoading}/>
      </div>
      <div style={{height: 600, width: '100%'}} hidden={showBucketsTable}>
        <DataTable rows={rows} columns={objectTableFields} doubleClick={getObjectOnClick} loading={isLoading}/>
      </div>
    </div>
  );
}

function DataTable(props) {
  return <DataGrid rows={props.rows}
                   columns={props.columns}
                   pageSize={10}
                   onCellDoubleClick={props.doubleClick}
                   columnBuffer={2}
                   loading={props.loading}
         />;
}
