import {Button, Dialog, DialogTitle, Hidden, Slide} from "@material-ui/core";
import React, {createContext, useState} from "react";
import {getAWSCred} from "../../../Common/Managers/EndpointManager";
import {getAuthCookie} from "../../../Common/Managers/CookieManager";
import Tooltip from '@material-ui/core/Tooltip';


const SlideUpTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CloseModalContext = createContext(undefined);

export function FileUploadComponent(props) {
  const [showModal, setShowModal] = useState(false);
  const [AWSAvail, setAWSAvail] = useState(AWSCredAvailable());

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  const fileInput = React.createRef();

  function AWSCredAvailable() {
    const cookie = getAuthCookie();
    return getAWSCred(cookie.email)
    .then ((res) => {
      if (res === null || res.data === "") {
        setAWSAvail(true);
      } else {
        //enable
        setAWSAvail(false);
      }
    });
  }

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
        <Tooltip disableFocusListener disableTouchListener title="Add or edit AWS Keys in your profile page.">
        <span>
          <Button variant="outlined" color="secondary" onClick={openModal} disabled={AWSAvail}>Import from AWS S3</Button>
        </span>
        </Tooltip>
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
        <CloseModalContext.Provider value={closeModal}>
          {props.AWSImportView}
        </CloseModalContext.Provider>
      </Dialog>
    </>
  );
}
