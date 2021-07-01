import {Button, Table, TextField} from "@material-ui/core";
import {registerAWS, listBuckets, listObjects} from "../common/Managers/EndpointManager";
import {useState} from "react";
import {DataGrid} from "@material-ui/data-grid";
import {makeStyles} from "@material-ui/core/styles";
import "./AWSImportView.css";

export default function AWSImportView() {
  const [idPool, setIdPool] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);


  function handleIdPoolChange(event) {
    setIdPool(event.target.value);
  }

  function createRows(rows) {
    return rows.map((row, index) => {
      return {id: index, ...row};
    });
  }

  function listObjectsOnClick(params, event) {
    const bucketName = params.row.Name;
    listObjects(bucketName)
      .then(res => {
        const objects = res.data;
        const jsons = objects.map(object => {
          return {Key: object.Key, Owner: object.Owner.DisplayName, LastModified: object.LastModified, Size: object.Size};
        });
        setColumns([
          { field: 'Key', headerName: 'Key', width: 300},
          { field: 'Owner', headerName: 'Owner', width: 300},
          { field: 'LastModified', headerName: 'Last Modified', width: 300},
          { field: 'Size', headerName: 'Size (in bytes)', width: 300}
        ]);
        setRows(createRows(jsons));
        // setHandleCellClick(getObjectOnClick);
      })
      .catch(err => {
        console.log(err);
      });
  }

  function getObjectOnClick(params, event) {
    const key = params.row.Key;

  }

  function formSubmitHandler(event) {
    event.preventDefault();
    return registerAWS(idPool)
      .then(res => {
        console.log(res);
        return listBuckets();
      })
      .then(res => {
        const buckets = res.data;
        setColumns([
          { field: 'Name', headerName: 'Name', width: 300},
          { field: "CreationDate", headerName: "Creation Date", width: 300}
        ]);
        setRows(createRows(buckets));
      })
      .catch(err => {
        console.log(err);
      });
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
                  onClick={formSubmitHandler}
          >
            Use credentials
          </Button>
        </form>
      </div>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={10} onCellDoubleClick={listObjectsOnClick}
                  columnBuffer={2}
        />
      </div>
    </>
  );
}
