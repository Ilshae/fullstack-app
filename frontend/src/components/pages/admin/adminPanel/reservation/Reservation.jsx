import React from "react";
import { useReservationReducer } from "./reservationReducer";
import Box from "@mui/material/Box";
import Placeholder from "../../../../common/Placeholder";
import { msg, nullOrUndefined, formatDate } from "../../../../../utils/utils";
import ReservationForm from "./ReservationForm";
import Button from "@mui/material/Button";
import Snackbar from "../../../../common/Snackbar";
import { validateReservationData } from "../../../../../utils/validation";

const Reservation = ({ match }) => {
  const [
    { reservationData, errors, initialState },
    {
      adminPanel,
      reservationQuery,
      createReservation,
      updateReservation,
      setReservationData,
      setErrors
    }
  ] = useReservationReducer(match);
  const { reservation, client } = reservationData;

  const validate = () => {
    const errors = validateReservationData(reservationData);
    setErrors({ data: { ...errors } });
    return !!(
      Object.values(errors.reservation).every(x => x === "") &&
      Object.values(errors.client).every(x => x === "")
    );
  };

  const handleCreate = async e => {
    e.preventDefault();
    if (validate())
      await createReservation
        .refetch()
        .then(
          res =>
            res.isSuccess && setReservationData(initialState.reservationData)
        );
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (validate()) await updateReservation.refetch();
  };

  const handleChange = (e, key) => {
    const { value, name } = e.target;
    const data = { [name]: value };
    setReservationData({ key, data });
  };

  const handleDatePicker = (e, key, field) => {
    let data;
    if (e && e.$d) data = { [field]: formatDate(e.$d) };
    else data = { [field]: formatDate(e) };
    setReservationData({ key, data });
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
          status={match?.params?.id ? reservationQuery.status : "initial"}
          errorCode={
            match?.params?.id
              ? reservationQuery?.error?.response?.status
              : "null"
          }
        >
          {!nullOrUndefined(reservation) && !nullOrUndefined(client) && (
            <>
              <ReservationForm
                reservationData={reservationData}
                errors={errors}
                handleChange={handleChange}
                handleDatePicker={handleDatePicker}
                resId={match?.params?.id}
                yachtId={match?.params?.yachtId}
              />
              <Box sx={{ marginTop: 5 }}>
                {match.params.yachtId ? (
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={createReservation.isFetching}
                  >
                    {msg("create")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={updateReservation.isFetching}
                  >
                    {msg("update")}
                  </Button>
                )}
              </Box>
            </>
          )}
          <Snackbar
            open={
              match?.params?.id
                ? updateReservation.isFetching ||
                  updateReservation.isSuccess ||
                  updateReservation.isError
                : createReservation.isFetching ||
                  createReservation.isSuccess ||
                  createReservation.isError
            }
            action={match?.params?.id ? "update" : "create"}
            status={
              match?.params?.id
                ? updateReservation.status
                : createReservation.status
            }
            errorCode={
              match?.params?.id
                ? updateReservation?.error?.response?.status
                : createReservation?.error?.response?.status
            }
          />
        </Placeholder>
      </Placeholder>
    </Box>
  );
};

export default Reservation;
