import React, { useContext } from "react";
import { Context } from "../../../../Wrapper";
import Input from "../../../common/Input";
import { formatDate } from "../../../../utils/utils";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import { enGB, pl } from "date-fns/locale";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./ReservationCalendar.scss";

const ReservationCalendar = ({
  disabledDates,
  selectedDates,
  handleChange,
  errors,
  price,
  fetchPrice,
  status,
  setSelectedDates
}) => {
  const context = useContext(Context);
  const disabled = status === "success";

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <DateRangePicker
        locale={context.locale === "pl-PL" ? pl : enGB}
        onChange={async item => {
          await setSelectedDates([item.selection]);
          if (!!item.selection?.startDate && !!item.selection?.endDate)
            await fetchPrice();
        }}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={3}
        ranges={selectedDates}
        direction="horizontal"
        dateDisplayFormat="d MMM yyyy"
        minDate={moment().toDate()}
        disabledDates={disabledDates}
      />
      <Grid
        container
        spacing={2}
        sx={{ width: "900px", marginBottom: 2, marginTop: 2 }}
      >
        <Input
          name="from"
          value={
            formatSelectedDates(selectedDates).startDate === "Invalid date"
              ? "??-??-??"
              : formatSelectedDates(selectedDates).startDate
          }
          handleChange={handleChange}
          error={errors.from}
          disabled={disabled}
          gridSize={4}
        />
        <Input
          name="to"
          value={
            formatSelectedDates(selectedDates).endDate === "Invalid date"
              ? "??-??-??"
              : formatSelectedDates(selectedDates).endDate
          }
          handleChange={handleChange}
          error={errors.to}
          disabled={disabled}
          gridSize={4}
        />
        <Input
          name="price"
          value={price ? price : 0}
          handleChange={handleChange}
          error={errors.price}
          disabled={disabled}
          gridSize={4}
          endAdorment="zł"
        />
      </Grid>
    </Box>
  );
};

const formatSelectedDates = selectedDates => {
  let date, startDate, endDate;
  selectedDates.map(
    item => (
      (startDate = formatDate(item.startDate)),
      (endDate = formatDate(item.endDate))
    )
  );
  date = {
    startDate,
    endDate
  };
  return date;
};

export default ReservationCalendar;
