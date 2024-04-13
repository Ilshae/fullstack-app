import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useIntl } from "react-intl";
import { msg } from "../../../../utils/utils";

const Equipment = ({
  tent,
  railings,
  bowBasket,
  emergencyMeasures,
  drinkingWaterInstallation,
  lakeWaterInstallation,
  hotWater,
  fridge,
  heating,
  tableware,
  cookingEquipment,
  radio,
  mp3,
  socket12v,
  installation220v,
  rectifier,
  echosounder,
  tv,
  other
}) => {
  const intl = useIntl();
  const isEmpty = i => i === false;
  const basicEquipment = [tent, railings, bowBasket, emergencyMeasures];
  const galleyAndMesa = [
    drinkingWaterInstallation,
    lakeWaterInstallation,
    hotWater,
    fridge,
    heating,
    tableware,
    cookingEquipment
  ];
  const powerAndMultimedia = [
    radio,
    mp3,
    socket12v,
    installation220v,
    echosounder,
    tv,
    rectifier
  ];

  return (
    <Box sx={{ p: 3, width: "50%", boxShadow: "none" }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
      >
        {msg("equipment")}
      </Typography>
      {!basicEquipment.every(isEmpty) && (
        <>
          <Typography
            variant="h6"
            color="text.secondary"
            component="div"
          >
            {msg("basicEquipment")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            {tent && `${intl.formatMessage({ id: "tent" })}, `}
            {railings && `${intl.formatMessage({ id: "railings" })}, `}
            {bowBasket && `${intl.formatMessage({ id: "bowBasket" })}, `}
            {emergencyMeasures &&
              `${intl.formatMessage({ id: "emergencyMeasures" })}`}
          </Typography>
        </>
      )}
      {!galleyAndMesa.every(isEmpty) && (
        <>
          <Typography
            variant="h6"
            color="text.secondary"
            component="div"
          >
            {msg("galleyAndMesa")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            {drinkingWaterInstallation &&
              `${intl.formatMessage({ id: "drinkingWaterInstallation" })}, `}
            {lakeWaterInstallation &&
              `${intl.formatMessage({ id: "lakeWaterInstallation" })}, `}
            {hotWater && `${intl.formatMessage({ id: "hotWater" })}, `}
            {fridge && `${intl.formatMessage({ id: "fridge" })}, `}
            {heating && `${intl.formatMessage({ id: "heating" })}, `}
            {tableware && `${intl.formatMessage({ id: "tableware" })}, `}
            {cookingEquipment &&
              `${intl.formatMessage({ id: "cookingEquipment" })}`}
          </Typography>
        </>
      )}
      {!powerAndMultimedia.every(isEmpty) && (
        <>
          <Typography
            variant="h6"
            color="text.secondary"
            component="div"
          >
            {msg("powerAndMultimedia")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            {radio && `${intl.formatMessage({ id: "radio" })}, `}
            {mp3 && `${intl.formatMessage({ id: "mp3" })}, `}
            {socket12v && `${intl.formatMessage({ id: "socket12v" })}, `}
            {installation220v &&
              `${intl.formatMessage({ id: "installation220v" })}, `}
            {echosounder && `${intl.formatMessage({ id: "echosounder" })}, `}
            {tv && `${intl.formatMessage({ id: "tv" })}, `}
            {rectifier && `${intl.formatMessage({ id: "rectifier" })}`}
          </Typography>
        </>
      )}
      {other && (
        <>
          <Typography
            variant="h6"
            color="text.secondary"
            component="div"
          >
            {msg("other")}
          </Typography>{" "}
          <Typography
            variant="body1"
            color="text.secondary"
          >
            {other && `${intl.formatMessage({ id: "other" })}`}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default Equipment;
