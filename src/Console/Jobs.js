import CollapsibleTable from "../Demo/Jobs";
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
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Job ID</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Starting Date</TableCell>
              <TableCell align="right">Finishing Date</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Button variant="contained" color="secondary"
              className={classes.submitJobButton} component={Link}
              to={`${props.url}/submitJob`}
      >
        New Job
      </Button>
    </div>
  );
}
