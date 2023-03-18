import { Snackbar } from "@material-ui/core";
import React from "react";
import { CryptoState } from "../CryptoContext";
import MuiAlert from "@material-ui/lab/alert";

const Alert = () => {
  const { alert, setAlert } = CryptoState();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlert({ open: false });
  };

  return (
    <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
      <MuiAlert
        onClose={handleClose}
        severity={alert.type}
        variant="filled"
        elevation={10}
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
