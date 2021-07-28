import {Button, Dialog, DialogTitle, Hidden, Slide} from "@material-ui/core";
import React, {useState} from "react";

const SlideUpTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FileUploadComponent(props) {
  const [showModal, setShowModal] = useState(false);

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  const fileInput = React.createRef();
  const awsImportView = props.AWSImportView(closeModal);

  return (
    <>
      <Hidden smUp={props.hidden}>
        {/*File Input Element*/}
        <label htmlFor="fileInput">
          <input type="file"
                 accept=".csv"
                 ref={fileInput}
                 style={{display: "none"}}
                 id="fileInput"
                 name="File Input"
                 onChange={(event) => props.onFilePicked(fileInput.current.files[0])}
          />
          <Button color="primary" variant="outlined" component="span">
            Upload CSV
          </Button>
        </label>

        {/*AWS Import button*/}
        <Button variant="outlined" color="secondary" onClick={openModal}>Import from AWS S3</Button>
      </Hidden>

      <Dialog
        open={showModal}
        maxWidth="lg"
        fullWidth
        onClose={closeModal}
        aria-labelledby="Import from AWS Form"
        aria-describedby="Input your AWS User details here"
        TransitionComponent={SlideUpTransition}
        keepMounted
      >
        <DialogTitle>Import from AWS</DialogTitle>
        {props.AWSImportView(closeModal)}
      </Dialog>

    </>
  );
}
