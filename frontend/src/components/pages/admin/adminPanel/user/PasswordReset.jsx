import React, { useState } from "react";
import { validatePasswordReset } from "../../../../../utils/validation";
import {
  getAdminContent,
  getUser,
  resetPassword as resetPasswordAPI
} from "../../../../../services/auth.service";
import Box from "@mui/material/Box";
import Placeholder from "../../../../common/Placeholder";
import { msg } from "../../../../../utils/utils";
import Button from "@mui/material/Button";
import Snackbar from "../../../../common/Snackbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Input from "../../../../common/Input";
import Divider from "@mui/material/Divider";
import { useQuery } from "@tanstack/react-query";

const PasswordReset = ({ match }) => {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { params } = match;

  const adminPanel = useQuery({
    queryKey: ["adminPanel"],
    queryFn: async () => await getAdminContent(),
    refetchOnWindowFocus: false
  });

  const resetPassword = useQuery({
    queryKey: ["resetPassword"],
    queryFn: async () =>
      await resetPasswordAPI(params.id, { password: String(password) }),
    refetchOnWindowFocus: false,
    enabled: false
  });

  const userNameQuery = useQuery({
    queryKey: ["userNameQuery"],
    queryFn: async () => await getUser(params.id),
    refetchOnWindowFocus: false
  });

  const validate = () => {
    const errors = validatePasswordReset(password);
    setErrors(errors);
    return !!Object.values(errors).every(x => x === "");
  };

  const handlePasswordReset = async e => {
    e.preventDefault();
    if (validate()) await resetPassword.refetch();
  };

  const handleChange = e => {
    setPassword(e.target.value);
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Placeholder
        status={adminPanel.status}
        errorCode={adminPanel?.error?.response?.status}
      >
        <Box>
          <Typography
            variant="h6"
            component="div"
            sx={{ marginBottom: 4, marginTop: 4, marginRight: 3 }}
          >
            {msg("adminPanelUserData")}&nbsp;&nbsp;&nbsp;
            {userNameQuery.data?.username}
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{ width: "1000px" }}
          >
            <Input
              name="password"
              value={password}
              handleChange={e => {
                handleChange(e);
              }}
              error={errors}
              type="password"
            />
          </Grid>
          <Divider sx={{ marginTop: 6 }} />
        </Box>
        <Box sx={{ marginTop: 5 }}>
          <Button
            variant="contained"
            onClick={handlePasswordReset}
            disabled={resetPassword.isFetching}
          >
            {msg("resetPassword")}
          </Button>
        </Box>
        <Snackbar
          open={
            resetPassword.isFetching ||
            resetPassword.isSuccess ||
            resetPassword.isError
          }
          action={"resetPassword"}
          status={resetPassword.status}
          errorCode={resetPassword?.error?.response?.status}
        />
      </Placeholder>
    </Box>
  );
};
export default PasswordReset;
