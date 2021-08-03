import {Box, Button, makeStyles, Grid} from "@material-ui/core";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {getJob, getJobs, deleteJob as deleteJobDB, downloadPredictionFile} from "../Common/Managers/EndpointManager";

import {useAuth} from "../Authentication/Auth";
import {useHistory} from "react-router-dom";
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
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
import {
  submitPrediction,
  getPredictions,
  deletePrediction as deletePredictionDB,
  deletePredictionJobID
} from "../Common/Managers/EndpointManager";
import DeleteIcon from '@material-ui/icons/Delete';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  jobActionButton: {
    margin: "3px",
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


export default function Jobs(props) {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const auth = useAuth();
  const history = useHistory();

  const url = props.url;

  useEffect(() => {
    getJobs(auth.user.email)
      .then(res => {
        const gottenJobs = res.data;
        setJobs(gottenJobs);
      });
  }, []);

  


  function Row(props) {

    const [row, setRow] = React.useState(props.row);
    const [rowState, setRowState] = React.useState({open: false, predictions: []});
    const classes = useRowStyles();
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {

        setDateTime(new Date());
        getJob(auth.user.email,row.id)
        .then(res => {
          const job = res.data[0];
          job.id = job._id;
          setRow(job);
        });
      }, 5000);
      return () => clearInterval(intervalId); //This is important
    });
    
    

    function deleteJob() {
      const jobId = row.id;
      deleteJobDB(auth.user.email, jobId)
        .then(_ => {
          deletePredictionJobID(auth.user.email, jobId);
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
      history.push({
        pathname: `${url}/submitPrediction`,
        state: row,
      });
    }

    function SubRow(props) {
      props.id = props._id;
      const created = new Date(props.created);
      const current = new Date();
      const diff = current-created;
      const minutes = Math.floor((diff/1000)/60);
      props.status=minutes>row.timer?"Finished":"Running";

      function deletePrediction() {
        const predictionID = props.id;
        deletePredictionDB(auth.user.email, predictionID).then(_ => {
          getPredictions(auth.user.email, row.id)
            .then(res => {
              const gottenPredictions = res.data;
              setRowState({open: rowState.open, predictions: gottenPredictions});
            });
        });
      }


      function downloadPrediction() {
        const predictionID = props.id;
        downloadPredictionFile(auth.user.email, predictionID)
          .then(res => {
            console.log("Starting download");
          })
          .catch(err => {
            console.log(err);
            alert("Unable to find prediction file");
          });

      }

      return (<TableRow key={props.date}>
        <TableCell align="center">
          {props.name}
        </TableCell>
        <TableCell align="center">{props.status}</TableCell>
        <TableCell align="center">{props.created}</TableCell>
        <TableCell align="center">
          {
            (props.status === "Running") ? <div style={{display: "none"}}/>
            : <Button variant="contained" className={classes.jobActionButton}
                      onClick={downloadPrediction} color="primary" startIcon={<GetAppIcon/>}
              />
          }
          <Button variant="contained"
                  className={classes.jobActionButton} onClick={deletePrediction} color="primary"
                  startIcon={<DeleteIcon/>}
          />
          
        </TableCell>
      </TableRow>);
    }

    function openButtonOnClick() {
      getPredictions(auth.user.email, row.id)
        .then(res => {
          const gottenPredictions = res.data;
          setRowState({open: !rowState.open, predictions: gottenPredictions});
      });

    }

    const created = new Date(row.created);
    const current = new Date();
    const diff = current-created;
    const minutes = Math.floor((diff/1000)/60);
    row.status=minutes>row.timer?"Finished":"Running";

    return (
      <>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={openButtonOnClick}>
              {rowState.open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.status}</TableCell>
          <TableCell align="right">{row.created}</TableCell>
          <TableCell align="right">{row.target_name}</TableCell>
          <TableCell align="center"><Button variant="contained"
                                            className={classes.jobActionButton} onClick={deleteJob} color="primary"
                                            name={row.name}
                                    >
            Delete
          </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.jobActionButton}
              onClick={newPrediction}
              name={row.id}
              disabled={row.status === "Running"}
            >
              New Prediction
            </Button>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>

            <Collapse in={rowState.open} timeout="auto" unmountOnExit>
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
                  <TableBody>
                    {rowState.predictions.map((prediction) => (
                      SubRow(prediction)
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>

          </TableCell>
        </TableRow>

      </>
    );
  }

  const rows = jobs;
  rows.forEach(function (data) {
    data.id = data._id;
  });
  return (
    <div>
      <Grid container justify="center">
        <Button variant="contained" color="secondary"
                className={classes.newJobButton} component={Link}
                to={`${url}/submitJob`}
        >
          New Job
        </Button>
      </Grid>

      <Box className={classes.jobTable}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>Job Name</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Starting Date</TableCell>
                <TableCell align="right">Target Column</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <Row key={row.id} row={row}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>
    </div>
  );
}
