import React from "react";
import Input from "../../../../common/Input";
import { msg } from "../../../../../utils/utils";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import "./UserForm.scss";

const UserForm = ({ userData, errors, handleChange }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        component="div"
        sx={{ marginBottom: 4, marginTop: 4, marginRight: 3 }}
      >
        {msg("adminPanelUserData")}
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ width: "1000px" }}
      >
        {Object.entries(userData).map(([key, value]) => {
          return (
            <React.Fragment key={key}>
              {key === "roles" ? (
                <FormControl
                  className={
                    "MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 css-1osj8n2-MuiGrid-root"
                  }
                  error={!!errors.userData[key]}
                >
                  <InputLabel
                    id={`select ${key}`}
                    className={`${
                      value.length === 0 ? "lowLabel" : "highLabel"
                    } ${errors.userData[key]} && "redlabel"`}
                  >
                    {msg(key)}
                  </InputLabel>
                  <Select
                    labelId={`select ${key}`}
                    name={key}
                    value={value}
                    label={key}
                    variant="standard"
                    onChange={e => {
                      handleChange(e);
                    }}
                    multiple
                  >
                    {Enum[key].map(item => (
                      <MenuItem
                        key={item}
                        value={item}
                      >
                        {msg(item)}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.userData[key] && (
                    <FormHelperText>{errors.userData[key]}</FormHelperText>
                  )}
                </FormControl>
              ) : (
                <Input
                  key={key}
                  name={key}
                  value={value}
                  handleChange={e => {
                    handleChange(e);
                  }}
                  error={errors.userData[key]}
                  type={key === "password" ? "password" : "string"}
                />
              )}
            </React.Fragment>
          );
        })}
      </Grid>
      <Divider sx={{ marginTop: 6 }} />
    </Box>
  );
};

const Enum = {
  roles: ["ROLE_ADMIN", "ROLE_USER"]
};

export default UserForm;
