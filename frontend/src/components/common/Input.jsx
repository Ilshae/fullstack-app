import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { msg } from "../../utils/utils";
import InputAdornment from "@mui/material/InputAdornment";

const Input = ({
  name,
  value,
  type,
  handleChange,
  maxLength = 150,
  gridSize = 6,
  error = null,
  disabled = false,
  endAdorment = false
}) => {
  const isMessage = name === "message";

  return (
    <Grid
      item
      xs={gridSize}
    >
      <TextField
        required={!isMessage}
        label={msg(name)}
        variant="filled"
        value={value}
        name={name}
        type={type}
        onChange={e => handleChange(e)}
        sx={{ width: "100%" }}
        InputProps={{
          endAdornment: endAdorment ? (
            <InputAdornment position="end">{endAdorment}</InputAdornment>
          ) : (
            false
          )
        }}
        inputProps={{
          maxLength: maxLength
        }}
        {...(error && { error: true, helperText: error })}
        disabled={disabled}
      />
    </Grid>
  );
};

export default Input;
