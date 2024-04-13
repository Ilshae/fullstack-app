import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { msg } from "../../../../../utils/utils";
import Grid from "@mui/material/Grid";
import Input from "../../../../common/Input";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Context } from "../../../../../Wrapper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormHelperText from "@mui/material/FormHelperText";
import "./ReservationForm.scss";
import { useQuery } from "@tanstack/react-query";
import { getYachtNameByResId } from "../../../../../services/reservation.service";
import { getYachtName } from "../../../../../services/yacht.service";

const ReservationForm = ({
  reservationData,
  errors,
  handleChange,
  handleDatePicker,
  resId,
  yachtId
}) => {
  const context = useContext(Context);
  const { reservation, client } = reservationData;

  const yachtName = useQuery({
    queryKey: ["yachtName"],
    queryFn: async () => {
      return resId
        ? await getYachtNameByResId(resId)
        : await getYachtName(yachtId);
    },
    refetchOnWindowFocus: false
  });

  return (
    <>
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ marginBottom: 4, marginTop: 4, marginRight: 3 }}
        >
          {msg("adminPanelReservationData")}&nbsp;&nbsp;&nbsp;
          {yachtName.data?.model} {yachtName.data?.modelNumber}{" "}
          {yachtName.data?.name}
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ width: "1000px" }}
        >
          {Object.entries(reservation).map(([key, value]) => {
            return (
              <React.Fragment key={key}>
                {key === "from" || key === "to" ? (
                  <Grid
                    item
                    xs={6}
                  >
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      adapterLocale={context.locale === "pl-PL" ? "pl" : "en"}
                    >
                      <DatePicker
                        label={msg(key)}
                        value={value}
                        onChange={e => {
                          handleDatePicker(e, "reservation", key);
                        }}
                        renderInput={params => (
                          <TextField
                            {...params}
                            variant="filled"
                            sx={{ width: "100%" }}
                            error={!!errors.reservation[key]}
                          />
                        )}
                        inputFormat="YYYY-MM-DD"
                      />
                      {errors.reservation[key] && (
                        <FormHelperText
                          sx={{ color: "rgb(215, 67, 67)", marginLeft: "15px" }}
                        >
                          {errors.reservation[key]}
                        </FormHelperText>
                      )}
                    </LocalizationProvider>
                  </Grid>
                ) : (
                  <Input
                    key={key}
                    name={key}
                    value={value}
                    handleChange={e => {
                      handleChange(e, "reservation");
                    }}
                    error={errors.reservation[key]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Grid>
        <Divider sx={{ marginTop: 6 }} />
      </Box>
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ marginBottom: 4, marginTop: 4, marginRight: 3 }}
        >
          {msg("adminPanelClient")}
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ width: "1000px" }}
        >
          {Object.entries(client).map(([key, value]) => {
            return (
              <Input
                key={key}
                name={key}
                value={value}
                handleChange={e => {
                  handleChange(e, "client");
                }}
                error={errors.client[key]}
              />
            );
          })}
        </Grid>
        <Divider sx={{ marginTop: 6 }} />
      </Box>
    </>
  );
};

export default ReservationForm;
