import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Snackbar from "../../../common/Snackbar";
import ReservationForm from "./ReservationForm";
import ReservationCalendar from "./ReservationCalendar";
import { formatDate, msg } from "../../../../utils/utils";
import { createReservation } from "../../../../services/reservation.service";
import { validateReservationData } from "../../../../utils/validation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Reservation = ({
  disabledDates,
  price,
  fetchDisabledDates,
  fetchPrice,
  reservationForm,
  selectedDates,
  setReservationForm,
  setSelectedDates,
  yachtId
}) => {
  const [errors, setErrors] = useState({
    reservation: {},
    client: {}
  });

  const submitReservation = useQuery({
    queryKey: ["submitReservation"],
    queryFn: async () => {
      let date = formatSelectedDates(selectedDates);
      const data = {
        startDate: date.startDate,
        endDate: date.endDate,
        ...reservationForm,
        yachtId
      };
      return await createReservation(data);
    },
    enabled: false,
    refetchOnWindowFocus: false
  });

  const handleChange = e => {
    setReservationForm(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      await submitReservation.refetch();
      await fetchDisabledDates();
    }
  };

  const validate = () => {
    const reservation = {
      price,
      from: selectedDates[0].startDate,
      to: selectedDates[0].endDate
    };
    const reservationData = { reservation, client: reservationForm };
    const errors = validateReservationData(reservationData, selectedDates[0]);
    setErrors({ ...errors });
    return !!(
      Object.values(errors.reservation).every(x => x === "") &&
      Object.values(errors.client).every(x => x === "")
    );
  };

  return (
    <Box sx={{ pt: 5, pb: 5, boxShadow: "none" }}>
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{ textAlign: "center" }}
      >
        {msg("reservation")}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <ReservationCalendar
          disabledDates={disabledDates}
          selectedDates={selectedDates}
          handleChange={handleChange}
          errors={errors.reservation}
          price={price}
          fetchPrice={fetchPrice}
          status={submitReservation.status}
          setSelectedDates={setSelectedDates}
        />
        <ReservationForm
          setReservationForm={setReservationForm}
          reservationForm={reservationForm}
          handleChange={handleChange}
          errors={errors.client}
          handleSubmit={handleSubmit}
          status={submitReservation.status}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          type="submit"
          sx={{ marginTop: 5 }}
          disabled={submitReservation.isFetching || submitReservation.isSuccess}
        >
          {msg("book")}
        </Button>
        <Snackbar
          open={
            submitReservation.isFetching ||
            submitReservation.isError ||
            submitReservation.isSuccess
          }
          action="reservation"
          status={submitReservation.status}
          errorCode={submitReservation?.error?.response?.status}
          errorMsg={submitReservation?.error?.response?.data?.message}
        />
      </Box>
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

export default Reservation;
