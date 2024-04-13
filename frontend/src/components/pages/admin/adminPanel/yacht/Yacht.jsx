import React from "react";
import { msg, nullOrUndefined } from "../../../../../utils/utils";
import Box from "@mui/material/Box";
import Placeholder from "../../../../common/Placeholder";
import YachtForm from "./YachtForm";
import Button from "@mui/material/Button";
import Snackbar from "../../../../common/Snackbar";
import { validateYachtData } from "../../../../../utils/validation";
import { useYachtReducer } from "./yachtReducer";

const Yacht = ({ match }) => {
  const [
    { yachtData, errors },
    {
      adminPanel,
      yachtDataQuery,
      galleryQuery,
      createYacht,
      updateYacht,
      handleCreateYacht,
      handleUpdateYacht,
      setYachtData,
      setErrors,
      addToGalleryToBeAdded,
      removeFromGalleryToBeAdded,
      addToGalleryToBeRemoved,
      removeFromGalleryToBeRemoved
    }
  ] = useYachtReducer(match);
  const { yacht, technicalData, equipment } = yachtData;

  const validate = () => {
    const errors = validateYachtData(
      yachtData,
      Object.keys(match.params).length === 0
    );
    setErrors({ data: { ...errors } });

    return !!(
      Object.values(errors.yacht).every(x => x === "") &&
      Object.values(errors.equipment).every(x => x === "") &&
      Object.values(errors.technicalData).every(x => x === "") &&
      Object.values(errors.galleryToBeAdded).every(x => x === "")
    );
  };

  const handleCreate = async e => {
    e.preventDefault();
    if (validate()) {
      await handleCreateYacht();
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (validate()) {
      await handleUpdateYacht();
    }
  };

  const handleChange = (e, key) => {
    const { value, name } = e.target;
    const data = { [name]: value };
    setYachtData({ key, data });
  };

  const handleCheckbox = (e, key) => {
    let { name, checked } = e.target;
    const data = { [name]: checked };
    setYachtData({ key, data });
  };

  const handleUploadButton = async e => {
    addToGalleryToBeAdded(Array.from(e.target.files));
  };

  const handleDeleteButtonInTempGallery = key => {
    removeFromGalleryToBeAdded(parseInt(key));
  };

  const handleDeleteButtonInOriginalGallery = id => {
    addToGalleryToBeRemoved(id);
  };

  const handleCancelButtonInOriginalGallery = key => {
    removeFromGalleryToBeRemoved(parseInt(key));
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
          status={match?.params?.id ? yachtDataQuery.status : "initial"}
          errorCode={
            match?.params?.id ? yachtDataQuery?.error?.response?.status : null
          }
        >
          {!nullOrUndefined(yacht) &&
            !nullOrUndefined(technicalData) &&
            !nullOrUndefined(equipment) && (
              <>
                <YachtForm
                  yachtData={yachtData}
                  galleryQuery={galleryQuery}
                  errors={errors}
                  handleChange={handleChange}
                  handleCheckbox={handleCheckbox}
                  handleUploadButton={handleUploadButton}
                  handleDeleteButtonInTempGallery={
                    handleDeleteButtonInTempGallery
                  }
                  handleDeleteButtonInOriginalGallery={
                    handleDeleteButtonInOriginalGallery
                  }
                  handleCancelButtonInOriginalGallery={
                    handleCancelButtonInOriginalGallery
                  }
                  params={match.params}
                />
                <Box sx={{ marginTop: 5 }}>
                  {Object.keys(match.params).length === 0 ? (
                    <Button
                      variant="contained"
                      onClick={handleCreate}
                      disabled={createYacht.isFetching}
                    >
                      {msg("create")}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      disabled={updateYacht.isFetching}
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
                ? updateYacht.isFetching ||
                  updateYacht.isSuccess ||
                  updateYacht.isError
                : createYacht.isFetching ||
                  createYacht.isSuccess ||
                  createYacht.isError
            }
            action={match?.params?.id ? "update" : "create"}
            status={match?.params?.id ? updateYacht.status : createYacht.status}
            errorCode={
              match?.params?.id
                ? updateYacht?.error?.response?.status
                : createYacht?.error?.response?.status
            }
          />
        </Placeholder>
      </Placeholder>
    </Box>
  );
};

export default Yacht;
