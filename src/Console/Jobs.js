import {Button, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import React, {useEffect, useState} from "react";
import {getJobs, deleteJob as deleteJobDB} from "../common/Managers/EndpointManager";
import {useAuth} from "../common/Auth";

const useStyles = makeStyles({
  submitJobButton: {
    float:"left",
    display: "flex",
    justify: "flex-end",
    margin: "auto",
    width: "15vh"
  },
  jobAttributeColumn: {
    align:"left",
  },
});


export default function Jobs(props) {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    getJobs()
        .then(res => {
          const gottenJobs = res.data;
          setJobs(gottenJobs);
        });
  }, []);

  function deleteJob(row) {
    const jobId = jobs[row];
    deleteJobDB(auth.user, jobId)
        .then(_ => console.log("Successfully deleted Job"))
        .catch(err => console.log(err));
  }

  return (
    <div>
      <Button variant="contained" color="secondary"
              className={classes.submitJobButton} component={Link}
              to={`${props.url}/submitJob`}
      >
        New Job
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className={classes.jobAttributeColumn}>Job ID</TableCell>
              <TableCell className={classes.jobAttributeColumn}>Job Name</TableCell>
              <TableCell className={classes.jobAttributeColumn}>Description</TableCell>
              <TableCell className={classes.jobAttributeColumn}>Status</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      
    </div>
  );
}
