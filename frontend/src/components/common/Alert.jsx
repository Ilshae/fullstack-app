import React from "react";
import Box from "@mui/material/Box";
import MUIAlert from "@mui/material/Alert";
import { msg } from "../../utils/utils";

const Alert = ({ text = "noData", styles }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...styles
      }}
    >
      <MUIAlert severity="error">{msg(text)}</MUIAlert>
    </Box>
  );
};

export default Alert;
