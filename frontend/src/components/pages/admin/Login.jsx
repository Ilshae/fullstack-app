import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { login } from "../../../services/auth.service";
import { msg } from "../../../utils/utils";
import { containsIllegalChars } from "../../../utils/validation";
import Box from "@mui/material/Box";
import Snackbar from "../../common/Snackbar";
import Input from "../../common/Input";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Login = () => {
  const [credentials, setCredentials] = useState({
    userName: "",
    password: ""
  });
  const [errors, setErrors] = useState({
    userName: false,
    password: false
  });
  const { userName, password } = credentials;

  const submitLogin = useQuery({
    queryKey: ["login"],
    queryFn: async () => await login(userName, password),
    enabled: false,
    refetchOnWindowFocus: false,
    retry: false
  });

  const validate = () => {
    let temp = {};
    temp.userName = !userName
      ? msg("requiredField")
      : containsIllegalChars(userName)
      ? msg("illegalChars")
      : "";
    temp.password = !password
      ? msg("requiredField")
      : containsIllegalChars(password)
      ? msg("illegalChars")
      : "";
    setErrors({ ...temp });
    return Object.values(temp).every(x => x === "");
  };

  const handleChange = e => {
    const { value, name } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      await submitLogin.refetch().then(res => {
        if (res.isError) setCredentials({ ...credentials, password: "" });
        if (res.isSuccess) window.location.reload();
      });
    }
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pl: 2,
        pr: 2
      }}
    >
      <Typography
        variant="h7"
        component="div"
        sx={{ marginBottom: 4, marginTop: 4 }}
      >
        {msg("loginTitle")}
      </Typography>
      <Input
        name="userName"
        value={userName}
        handleChange={handleChange}
        error={errors.userName}
        disabled={submitLogin.isFetching}
      />
      <Input
        name="password"
        value={password}
        type="password"
        handleChange={handleChange}
        error={errors.password}
        disabled={submitLogin.isFetching}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        type="submit"
        sx={{ marginTop: 5 }}
        disabled={submitLogin.isFetching}
      >
        {msg("logIn")}
      </Button>
      <Snackbar
        open={
          submitLogin.isFetching || submitLogin.isError || submitLogin.isSuccess
        }
        action="loggingIn"
        status={submitLogin.status}
        errorCode={submitLogin?.error?.response?.status}
      />
    </Box>
  );
};
export default Login;
