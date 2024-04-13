import React from "react";
import { useUserReducer } from "./userReducer";
import { validateUserData } from "../../../../../utils/validation";
import Placeholder from "../../../../common/Placeholder";
import UserForm from "./UserForm";
import { msg, nullOrUndefined } from "../../../../../utils/utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "../../../../common/Snackbar";

const User = ({ match }) => {
  const [
    { userData, errors },
    { adminPanel, userQuery, createUser, updateUser, setUserData, setErrors }
  ] = useUserReducer(match);
  const { params } = match;

  const validate = () => {
    const errors = validateUserData(userData, params);
    setErrors({ data: { ...errors } });
    return !!Object.values(errors.userData).every(x => x === "");
  };

  const handleCreate = async e => {
    e.preventDefault();
    if (validate()) await createUser.refetch();
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (validate()) await updateUser.refetch();
  };

  const handleChange = e => {
    const { value, name } = e.target;
    const userData = { [name]: value };
    setUserData(userData);
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
        <Placeholder
          status={params?.id ? userQuery.status : "initial"}
          errorCode={params?.id ? userQuery?.error?.response?.status : null}
        >
          {!nullOrUndefined(userData) && (
            <>
              <UserForm
                userData={userData}
                errors={errors}
                handleChange={handleChange}
              />
              <Box sx={{ marginTop: 5 }}>
                {Object.keys(params).length === 0 ? (
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={createUser.isFetching}
                  >
                    {msg("create")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={updateUser.isFetching}
                  >
                    {msg("update")}
                  </Button>
                )}
              </Box>
            </>
          )}
          <Snackbar
            open={
              params?.id
                ? updateUser.isFetching ||
                  updateUser.isSuccess ||
                  updateUser.isError
                : createUser.isFetching ||
                  createUser.isSuccess ||
                  createUser.isError
            }
            action={params?.id ? "update" : "create"}
            status={params?.id ? updateUser.status : createUser.status}
            errorCode={
              params?.id
                ? updateUser?.error?.response?.status
                : createUser?.error?.response?.status
            }
            errorMsg={
              params?.id
                ? updateUser?.error?.response?.data?.message
                : createUser?.error?.response?.data?.message
            }
          />
        </Placeholder>
      </Placeholder>
    </Box>
  );
};

export default User;
