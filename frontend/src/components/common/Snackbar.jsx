import React from "react";
import Alert from "@mui/material/Alert";
import MUISnackbar from "@mui/material/Snackbar";
import {
  capitalizeFirstLetter,
  msg,
  includesErrorStatuses
} from "../../utils/utils";

const Snackbar = ({ open, action, status, errorCode, errorMsg }) => {
  return (
    <MUISnackbar
      open={open}
      autoHideDuration={1000}
    >
      <Alert
        severity={severity(status)}
        sx={{ width: "100%" }}
      >
        {msg(text(action, status, errorCode, errorMsg))}
      </Alert>
    </MUISnackbar>
  );
};

const severity = status => {
  switch (status) {
    case "success":
      return "success";
    case "error":
      return "error";
    default:
      return "info";
  }
};

const text = (action, status, errorCode, errorMsg) => {
  if (
    action === "reservation" &&
    errorCode === 400 &&
    errorMsg === "Error: One of selected dates is already reserved!"
  )
    return "alertReservationTaken";
  else if (
    (action === "create" || action === "update") &&
    errorCode === 400 &&
    errorMsg === "Error: Username is already taken!"
  )
    return "alertUsernameTaken";
  else if (
    (action === "create" || action === "update") &&
    errorCode === 400 &&
    errorMsg === "Error: Email is already in use!"
  )
    return "alertEmailTaken";
  else if (action === "loggingIn" && errorCode === 401) return "badCredentials";
  else if (includesErrorStatuses(errorCode)) return `error${errorCode}`;
  return `${action}Alert${capitalizeFirstLetter(status)}`;
};

export default Snackbar;
