import CollapsibleTable from "../Demo/Jobs";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import React from "react";

export default function Dashboard() {
  return (
    <>
      <h1 style={{textAlign: "center"}}>Jobs</h1>
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
    </>
  );
}
