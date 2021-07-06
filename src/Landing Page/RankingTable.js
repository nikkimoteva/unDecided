import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import "./Landing.css";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function createData(name, ensemble, autogluon, autosk2, autosk, cmu, h2o) {
  return { name, ensemble, autogluon, autosk2, autosk, cmu, h2o };
}

const rows = [
  createData('Average Accuracy', "1st", "2nd", "3rd", "4th", "5th", "6th"),
  createData('Average Dataset Ranking', "1st", "2nd", "4th", "3rd", "5th", "6th"),
  createData('Majority Voting Scheme', "2nd", "1st", "3rd", "3rd", "4th", "4th"),
];

const useStyles = makeStyles({
    root: {
      width: "30%"
    },
});

export default function CustomizedTables() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
      {/* <Table> */}
        <TableHead>
          <TableRow>
            <StyledTableCell>AutoML Engine</StyledTableCell>
            <StyledTableCell align="right" className="ensembled">Ensemble Squared</StyledTableCell>
            <StyledTableCell align="right">AutoGluon</StyledTableCell>
            <StyledTableCell align="right">Auto Sklearn 2</StyledTableCell>
            <StyledTableCell align="right">Auto Sklearn</StyledTableCell>
            <StyledTableCell align="right">CMU AutoM</StyledTableCell>
            <StyledTableCell align="right">H2O AutoML</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right" className="ensembled">{row.ensemble}</StyledTableCell>
              <StyledTableCell align="right">{row.autogluon}</StyledTableCell>
              <StyledTableCell align="right">{row.autosk2}</StyledTableCell>
              <StyledTableCell align="right">{row.autosk}</StyledTableCell>
              <StyledTableCell align="right">{row.cmu}</StyledTableCell>
              <StyledTableCell align="right">{row.h2o}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}