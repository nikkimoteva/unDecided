import {Button} from "@material-ui/core";
import React from "react";


export default function SubmitButton(props) {
  return (
    <div>
      <Button type="submit"
              variant="contained"
              color="primary"
              onClick={props.submitHandler}
              style={{height: "6vh", width: "52vh"}}
      >
        Submit
      </Button>
    </div>
  );
}
