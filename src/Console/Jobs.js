import {Box, Button, makeStyles, Grid} from "@material-ui/core";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";

import {getJobs, deleteJob as deleteJobDB, downloadPredictionFile} from "../Common/Managers/EndpointManager";

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
import RefreshIcon from '@material-ui/icons/Refresh';
import LinearProgress from '@material-ui/core/LinearProgress';
import dateFormat from 'dateformat';


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
  },
  progressBar: {
    width: "650px"
  }
});


export default function Jobs(props) {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const auth = useAuth();
  const history = useHistory();

  const url = props.url;

  function updateJobRows() {
    getJobs(auth.user.email)
      .then(res => {
        const gottenJobs = res.data;
        for (const gottenJob of gottenJobs) {
            gottenJob.open = false;
            gottenJob.predictions=[];
            for (const existingJob of jobs) {
              if(gottenJob._id.localeCompare(existingJob._id)===0){
                gottenJob.open = existingJob.open;
                gottenJob.predictions=existingJob.predictions;
                if(gottenJob.open){
                  //get latest prediction
                }
              }
            }
          }
        setJobs(gottenJobs);
      });
  }

  useEffect(() => {
    updateJobRows();
  }, []);

  useEffect(() => {
      const intervalId = setInterval(() => {

        getJobs(auth.user.email)
        .then(res => {
          const gottenJobs = res.data;
          for (const gottenJob of gottenJobs) {
            gottenJob.open = false;
            gottenJob.predictions=[];
            for (const existingJob of jobs) {
              if(gottenJob._id.localeCompare(existingJob._id)===0){
                gottenJob.open = existingJob.open;
                gottenJob.predictions=existingJob.predictions;
                if(gottenJob.open){
                  //get latest prediction
                }
              }
            }
          }
          setJobs(gottenJobs);
        });
      }, 30000);
      return () => clearInterval(intervalId); //This is important
    });

  
  function ProgressBar(props){
      return (
        <>
          {props.status==="Running"&&
            <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={props.colSpan}>
              <LinearProgress variant="determinate" value={props.progress} />
            </TableCell>
          }
        </>
      );
    }

  function Row(props) {

    const row = props.row;
    const [rowState, setRowState] = React.useState({open: row.open, predictions: row.predictions});
    const classes = useRowStyles();

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
          for (const gottenJob of gottenJobs) {
            gottenJob.open = false;
            gottenJob.predictions=[];
          }
          setJobs(gottenJobs);
        })
        .catch(err => console.log(err));
    }

    function newPrediction() {
      history.push({
        pathname: `${url}/submitPrediction:${row.id}`,
        state: row,
      });
    }

    function SubRow(props) {
      props.id = props._id;
      const timeTaken = Math.min(props.time_elapsed,row.timer+5);
      props.progress = timeTaken/(row.timer+5)*100;
      function deletePrediction() {
        const predictionID = props.id;
        deletePredictionDB(auth.user.email, predictionID).then(_ => {
          getPredictions(auth.user.email, row.id)
            .then(res => {
              const gottenPredictions = res.data;
              const copyJobs = jobs.slice();
              for (const existingJob of copyJobs) {
                if(row.id===existingJob._id){
                  existingJob.predictions=gottenPredictions;
                  setJobs(copyJobs);
                }
              }
            });
        });
      }


      function downloadPrediction() {
        const predictionID = props.id;
        downloadPredictionFile(auth.user.email, predictionID)
          .then(res => {
            console.log("Starting download");
            // Disgusting JS stack code to make it actually force a download (from https://stackoverflow.com/questions/58630869/download-file-from-express-api-using-react-and-axios)
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'results.csv');
            link.setAttribute('type', 'text/csv');
            document.body.appendChild(link);
            link.click();
          })
          .catch(err => {
            console.log(err);
            alert("Unable to find prediction file");
          });

      }

      return (
        <>
          <TableRow key={props.date}>
            <TableCell align="center">
              {props.name}
            </TableCell>
            <TableCell align="center">{props.status}</TableCell>
            <TableCell align="center">{dateFormat(props.created, "mmmm dS, yyyy, h:MM:ss TT")}</TableCell>
            <TableCell align="center">
              {
                (props.status === "Successful") ?
                 <Button variant="contained" className={classes.jobActionButton}
                          onClick={downloadPrediction} color="primary" startIcon={<GetAppIcon/>}
                 />
                :<div style={{display: "none"}}/>
              }
              <Button variant="contained"
                      className={classes.jobActionButton} onClick={deletePrediction} color="primary"
                      startIcon={<DeleteIcon/>}
              />

            </TableCell>
          </TableRow>

          <ProgressBar status={props.status}progress={props.progress} colSpan={3}/>

        </>

      );
    }

    async function openButtonOnClick() {
      const copyJobs = jobs.slice();
      for (const existingJob of copyJobs) {
        if(row.id===existingJob._id){
          existingJob.open = !existingJob.open;
          if(existingJob.open){
            const res = await getPredictions(auth.user.email, row.id);
            existingJob.predictions = res.data;
          }
        }
        else{
          existingJob.open=false;
        }
        
      }
      setJobs(copyJobs);
    }

    const timeTaken = Math.min(row.time_elapsed,row.timer+5);
    row.progress = timeTaken/(row.timer+5)*100;
    return (
      <>

        <TableRow className={classes.root}>

          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={openButtonOnClick}>
              {row.open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.status}</TableCell>
          <TableCell align="right">{dateFormat(row.created, "mmmm dS, yyyy, h:MM:ss TT")}</TableCell>
          <TableCell align="right">{row.target_name}</TableCell>
          <TableCell align="center"><Button variant="contained"
            className={classes.jobActionButton} onClick={deleteJob} color="primary"
            name={row.name}
            startIcon={<DeleteIcon/>}
                                    />
          <Button
            variant="contained"
            color="primary"
            className={classes.jobActionButton}
            onClick={newPrediction}
            name={row.id}
            disabled={row.status !=="Successful"}
          >
            New Prediction
          </Button>
          </TableCell>
        </TableRow>
        <ProgressBar status={row.status} progress={row.progress} colSpan={6}/>


        <TableRow>
          <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
            <Collapse in={row.open} timeout="auto" unmountOnExit>
              {row.predictions.length!==0&&
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
                    {row.predictions.map((prediction) => (
                      SubRow(prediction)
                    ))}
                  </TableBody>
                </Table>
              </Box>}
              {row.predictions.length===0&&
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  No Prediction Submitted
                </Typography>
              </Box>}
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
        <Button variant="outlined" color="secondary" onClick={updateJobRows} style={{margin: "10px 0"}}>
          <RefreshIcon/>
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
