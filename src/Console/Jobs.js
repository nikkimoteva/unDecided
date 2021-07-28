import {Box, Button, makeStyles, Grid} from "@material-ui/core";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getJobs, deleteJob as deleteJobDB} from "../common/Managers/EndpointManager";
import {useAuth} from "../common/Auth";
import {DataGrid} from '@material-ui/data-grid';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


const useStyles = makeStyles({
  jobButtonContainer: {
    justifyContent: 'center',
  },
  newJobButton: {
    display: "flex",
    float: "left",
    justify: "flex-end",
    margin: "10px",
    width: "15vh",

  },
  jobAttributeColumn: {
    align: "left",
  },
  jobTable: {
    height: "650px",
    width: "95%",
    margin: "0 auto",

    // display:"block",
    // overflow:"auto"
  }
});

function createData(job, stat, finish, end) {
  
  const data = {
    job, stat, finish, end,
    history: [
        {Total_Ram: "32GB", Average_Ram_Usage: "21.4GB", Percentage_Processed: "99.9%"},
    ],
  };
  return data;
}



export default function Jobs(props) {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const auth = useAuth();

  useEffect(() => {

    getJobs(auth.user.email)
      .then(res => {
        const gottenJobs = res.data;
        setJobs(gottenJobs);
      });
  }, []);



function Row(props) {

  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  function deleteJob() {
    const jobId = row.id;
    deleteJobDB(auth.user.email, jobId)
      .then(_ => {
        console.log("Successfully deleted Job");
        return getJobs(auth.user.email);
      })
      .then(res => {
        const gottenJobs = res.data;
        setJobs(gottenJobs);
      })
      .catch(err => console.log(err));
  }

  function newPrediction() {
    console.log("supposed to create prediction");
    //stub
  }

  return (
    <>

      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">{row.created}</TableCell>
        <TableCell align="right">{row.target_name}</TableCell>
        <Button variant="contained" color="secondary"
          className={classes.newJobButton} onClick={deleteJob} name = {row.name}
        >
          Delete
        </Button>
        <Button variant="contained" color="secondary"
          className={classes.newJobButton} onClick={newPrediction} name = {row.id}
        >
          New Prediction
        </Button>


      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>

          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Predictions
              </Typography>
              <Table size="small" aria-label="purchases">

                <TableHead>
                  <TableRow>
                    <TableCell align="center">Prediction Name</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Time Created</TableCell>
                  </TableRow>
                </TableHead>
                {/*<TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.Total_Ram}
                      </TableCell>
                      <TableCell align="right">{historyRow.Average_Ram_Usage}</TableCell>
                      <TableCell align="right">{historyRow.Percentage_Processed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>*/}
              </Table>
            </Box>
          </Collapse>

        </TableCell>
      </TableRow>

    </>
  );
}


  const rows = jobs;
  console.log(jobs);
  rows.forEach(function (data) {
    data.id = data._id;
  });
  return (
    <div>
      <Grid container justify="center">


        <Button variant="contained" color="secondary"
                className={classes.newJobButton} component={Link}
                to={`${props.url}/submitJob`}
        >
          New Job
        </Button>
      </Grid>

     
    <Box className={classes.jobTable}>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Job Name</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Starting Date</TableCell>
              <TableCell align="right">Target Column</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Box>


    </div>
  );
}
