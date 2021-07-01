import {Button, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import React from "react";

const useStyles = makeStyles({
  submitJobButton: {
    float:"left",
    display: "flex",
    justify: "flex-end",
    margin: "auto",
    width: "20vh"
  },
});


export default function Jobs(props) {
  const classes = useStyles();

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
              <TableCell>Job ID</TableCell>
              <TableCell align="right">Job Name</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      
    </div>
  );
}
