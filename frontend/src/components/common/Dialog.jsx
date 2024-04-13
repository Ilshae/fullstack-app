import React from "react";
import { msg } from "../../utils/utils";
import MUIDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const Dialog = ({ handleCancel, handleOk, text }) => {
  return (
    <MUIDialog open={true}>
      <DialogTitle sx={{ padding: "3rem 5rem 3rem 5rem" }}>
        {msg(text)}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleCancel}>{msg("cancel")}</Button>
        <Button onClick={handleOk}>{msg("confirm")}</Button>
      </DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
