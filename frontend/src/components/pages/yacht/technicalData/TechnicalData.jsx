import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { msg } from "../../../../utils/utils";

const TechnicalData = ({
  length,
  width,
  height,
  engineType,
  engineManufacturer,
  enginePower,
  depth,
  mass,
  bottomBalast,
  sailsSurface,
  keelType,
  keelWeight,
  stereType
}) => {
  return (
    <Box sx={{ pt: 5, pb: 5, width: "50%", boxShadow: "none" }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
      >
        {msg("technicalData")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
      >
        {msg("length")}: {length} {msg("m")}
        <br />
        {msg("width")}: {width} {msg("m")}
        <br />
        {msg("height")}: {height} {msg("m")}
        <br />
        {msg("engine")}:{" "}
        {msg(engineType === "outboard" ? "engineOutboard" : "engineStationary")}{" "}
        {engineManufacturer} {enginePower} {msg("horsePower")}
        <br />
        {msg("depth")}: {depth} {msg("m")}
        <br />
        {msg("mass")}: {mass} {msg("kg")}
        <br />
        {msg("bottomBalast")}: {bottomBalast} {msg("kg")}
        <br />
        {msg("sailsSurface")}: {sailsSurface} {msg("m")}
        <sup>2</sup>
        <br />
        {msg("keel")}:{" "}
        {msg(keelType === "lifting" ? "keelLifting" : "keelFull")}
        <br />
        {msg("keelWeight")}: {keelWeight} {msg("kg")}
        <br />
        {msg("stere")}:{" "}
        {msg(stereType === "finOnRansom" ? "finOnRansom" : "steeringWheel")}
      </Typography>
    </Box>
  );
};

export default TechnicalData;
