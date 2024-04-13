import React from "react";
import { usePriceReducer } from "./priceReducer";
import { validatePriceData } from "../../../../../utils/validation";
import Placeholder from "../../../../common/Placeholder";
import { formatDate, msg, nullOrUndefined } from "../../../../../utils/utils";
import PriceForm from "./PriceForm";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "../../../../common/Snackbar";

const Price = ({ match }) => {
  const [
    { priceData, errors },
    {
      adminPanel,
      priceQuery,
      createPrice,
      updatePrice,
      setPriceData,
      setErrors
    }
  ] = usePriceReducer(match);

  const validate = () => {
    const errors = validatePriceData(priceData);
    setErrors({ data: { ...errors } });

    return !!Object.values(errors.priceData).every(x => x === "");
  };

  const handleCreate = async e => {
    e.preventDefault();
    if (validate())
      await createPrice
        .refetch()
        .then(res => res.isSuccess && setPriceData({ date: "", price: "" }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (validate()) await updatePrice.refetch();
  };

  const handleChange = e => {
    const { value, name } = e.target;
    const priceData = { [name]: value };
    setPriceData(priceData);
  };

  const handleDatePicker = (e, key, field) => {
    const priceData = { [field]: formatDate(e.$d) };
    setPriceData(priceData);
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
          status={match?.params?.id ? priceQuery.status : "initial"}
          errorCode={
            match?.params?.id ? priceQuery?.error?.response?.status : "null"
          }
        >
          {!nullOrUndefined(priceData) && (
            <>
              <PriceForm
                priceData={priceData}
                errors={errors}
                handleChange={handleChange}
                handleDatePicker={handleDatePicker}
                priceId={match?.params?.id}
                yachtId={match?.params?.yachtId}
              />
              <Box sx={{ marginTop: 5 }}>
                {match.params.yachtId ? (
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={createPrice.isFetching}
                  >
                    {msg("create")}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={updatePrice.isFetching}
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
                ? updatePrice.isFetching ||
                  updatePrice.isSuccess ||
                  updatePrice.isError
                : createPrice.isFetching ||
                  createPrice.isSuccess ||
                  createPrice.isError
            }
            action={match?.params?.id ? "update" : "create"}
            status={match?.params?.id ? updatePrice.status : createPrice.status}
            errorCode={
              match?.params?.id
                ? updatePrice?.error?.response?.status
                : createPrice?.error?.response?.status
            }
          />
        </Placeholder>
      </Placeholder>
    </Box>
  );
};
export default Price;
