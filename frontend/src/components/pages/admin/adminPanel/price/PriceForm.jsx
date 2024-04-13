import React, { useContext } from "react";
import Typography from "@mui/material/Typography";
import { msg } from "../../../../../utils/utils";
import Grid from "@mui/material/Grid";
import Input from "../../../../common/Input";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Context } from "../../../../../Wrapper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery } from "@tanstack/react-query";
import { getYachtNameByPriceId } from "../../../../../services/price.service";
import { getYachtName } from "../../../../../services/yacht.service";

const PriceForm = ({
  priceData,
  errors,
  handleChange,
  handleDatePicker,
  priceId,
  yachtId
}) => {
  const context = useContext(Context);

  const yachtName = useQuery({
    queryKey: ["yachtName"],
    queryFn: async () => {
      return priceId
        ? await getYachtNameByPriceId(priceId)
        : await getYachtName(yachtId);
    },
    refetchOnWindowFocus: false
  });

  return (
    <Box>
      <Typography
        variant="h6"
        component="div"
        sx={{ marginBottom: 4, marginTop: 4, marginRight: 3 }}
      >
        {priceData.id ? (
          <>
            {msg("yachtId")} {priceData.id} <br />
          </>
        ) : (
          ""
        )}
        {msg("adminPanelPriceData")}&nbsp;&nbsp;&nbsp;
        {yachtName.data?.model} {yachtName.data?.modelNumber}{" "}
        {yachtName.data?.name}
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ width: "1000px" }}
      >
        {Object.entries(priceData).map(([key, value]) => {
          return (
            <React.Fragment key={key}>
              {key === "date" ? (
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
                          error={!!errors.priceData[key]}
                        />
                      )}
                      inputFormat="YYYY-MM-DD"
                    />
                    {errors.priceData[key] && (
                      <FormHelperText
                        sx={{ color: "rgb(215, 67, 67)", marginLeft: "15px" }}
                      >
                        {errors.priceData[key]}
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
                    handleChange(e);
                  }}
                  error={errors.priceData[key]}
                  endAdorment={key === "price" && "zł"}
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

export default PriceForm;
