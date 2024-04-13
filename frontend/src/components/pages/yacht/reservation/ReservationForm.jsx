import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Input from "../../../common/Input";

const ReservationForm = ({
  reservationForm,
  handleChange,
  errors,
  handleSubmit,
  status
}) => {
  const {
    firstname,
    lastname,
    email,
    phoneNumber,
    patentNumber,
    postCode,
    street,
    streetNumber,
    city,
    message
  } = reservationForm;
  const disabled = status === "success";

  return (
    <Box
      id={"reservation-form"}
      component="form"
      noValidate
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{ width: "900px" }}
      >
        <Input
          name="firstname"
          value={firstname}
          handleChange={handleChange}
          error={errors.firstname}
          disabled={disabled}
        />
        <Input
          name="lastname"
          value={lastname}
          handleChange={handleChange}
          error={errors.lastname}
          disabled={disabled}
        />
        <Input
          name="email"
          value={email}
          handleChange={handleChange}
          error={errors.email}
          disabled={disabled}
        />
        <Input
          name="phoneNumber"
          value={phoneNumber}
          maxLength={20}
          handleChange={handleChange}
          error={errors.phoneNumber}
          disabled={disabled}
        />
        <Input
          name="patentNumber"
          value={patentNumber}
          maxLength={20}
          handleChange={handleChange}
          error={errors.patentNumber}
          disabled={disabled}
        />
        <Input
          name="postCode"
          value={postCode}
          maxLength={8}
          handleChange={handleChange}
          error={errors.postCode}
          disabled={disabled}
        />
        <Input
          name="city"
          value={city}
          handleChange={handleChange}
          error={errors.city}
          disabled={disabled}
        />
        <Input
          name="street"
          value={street}
          handleChange={handleChange}
          error={errors.street}
          disabled={disabled}
        />
        <Input
          name="streetNumber"
          value={streetNumber}
          maxLength={8}
          handleChange={handleChange}
          error={errors.streetNumber}
          disabled={disabled}
        />
        <Input
          name="message"
          value={message}
          maxLength={512}
          handleChange={handleChange}
          error={errors.message}
          disabled={disabled}
        />
      </Grid>
    </Box>
  );
};

export default ReservationForm;
