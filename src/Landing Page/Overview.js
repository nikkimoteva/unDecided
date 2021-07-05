import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Information from "./Information";

const useStyles = makeStyles({
  root: {
      alignItems: "center",
      width: "30%"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function OutlinedCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined" style={{"margin":"auto"}}>
      <CardContent>
        <Information />
      </CardContent>
      <CardActions>
        <a href="https://arxiv.org/pdf/2012.05390.pdf" target="_blank" rel="noreferrer" style={{"margin":"0 auto"}}>Learn More</a>
      </CardActions>
    </Card>
  );
}