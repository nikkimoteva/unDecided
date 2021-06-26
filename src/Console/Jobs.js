import CollapsibleTable from "../Demo/Jobs";
import {Button, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

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
      <CollapsibleTable/>
      <Button variant="contained" color="secondary"
              className={classes.submitJobButton} component={Link}
              to={`${props.url}/submitJob`}
      >
        New Job
      </Button>
    </div>
  );
}
