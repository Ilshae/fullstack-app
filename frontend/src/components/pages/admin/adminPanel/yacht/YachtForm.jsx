import React from "react";
import Input from "../../../../common/Input";
import Placeholder from "../../../../common/Placeholder";
import { capitalizeFirstLetter, msg } from "../../../../../utils/utils";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import "./YachtForm.scss";

const YachtForm = ({
  yachtData,
  galleryQuery,
  errors,
  handleChange,
  handleCheckbox,
  handleUploadButton,
  handleDeleteButtonInTempGallery,
  handleDeleteButtonInOriginalGallery,
  handleCancelButtonInOriginalGallery,
  params
}) => {
  const {
    yacht,
    technicalData,
    equipment,
    gallery,
    galleryToBeAdded,
    galleryToBeRemoved
  } = yachtData;

  const getAdorment = value => {
    switch (value) {
      case "length":
      case "width":
      case "height":
      case "depth":
        return "m";
      case "sailsSurface":
        return "m2";
      case "mass":
      case "bottomBalast":
      case "keelWeight":
        return "kg";
      case "enginePower":
        return "KM";
      default:
        return false;
    }
  };

  return (
    <>
      <Box>
        <Typography
          variant="h6"
          component="div"
          sx={{ marginBottom: 4, marginTop: 4, marginRight: 3 }}
        >
          {msg("adminPanelYachtData")}
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ width: "1000px" }}
        >
          {Object.entries(yacht).map(([key, value]) => {
            return (
              <Input
                key={key}
                name={key}
                value={value}
                handleChange={e => {
                  handleChange(e, "yacht");
                }}
                error={errors.yacht[key]}
              />
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
          {msg("adminPanelTechnicalData")}
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ width: "1000px" }}
        >
          {Object.entries(technicalData).map(([key, value]) => {
            return (
              <React.Fragment key={key}>
                {key === "engineType" ||
                key === "keelType" ||
                key === "stereType" ? (
                  <FormControl
                    className={
                      "MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 css-1osj8n2-MuiGrid-root"
                    }
                    error={!!errors.technicalData[key]}
                  >
                    <InputLabel
                      id={`select ${key}`}
                      className={`${
                        value.length === 0 ? "lowLabel" : "highLabel"
                      } ${errors.technicalData[key]} && "redlabel"`}
                    >
                      {msg(key)}
                    </InputLabel>
                    <Select
                      labelId={`select ${key}`}
                      name={key}
                      value={value}
                      label={key}
                      variant="standard"
                      onChange={e => {
                        handleChange(e, "technicalData");
                      }}
                    >
                      {Enum[key].map(item => (
                        <MenuItem
                          key={item}
                          value={item}
                        >
                          {key === "engineType"
                            ? msg(`engine${capitalizeFirstLetter(item)}`)
                            : msg(item)}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.technicalData[key] && (
                      <FormHelperText>
                        {errors.technicalData[key]}
                      </FormHelperText>
                    )}
                  </FormControl>
                ) : (
                  <Input
                    name={key}
                    value={value}
                    handleChange={e => {
                      handleChange(e, "technicalData");
                    }}
                    error={errors.technicalData[key]}
                    endAdorment={getAdorment(key)}
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
          {msg("adminPanelEquipment")}
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ width: "1000px" }}
        >
          <FormGroup
            row={true}
            sx={{ paddingLeft: 2 }}
          >
            {Object.entries(equipment).map(([key, value]) => {
              return (
                <React.Fragment key={key}>
                  {key === "other" ? (
                    <Input
                      key={key}
                      name={key}
                      value={value}
                      handleChange={e => {
                        handleChange(e, "equipment");
                      }}
                      error={errors.equipment[key]}
                      sx={{ marginTop: "20px" }}
                    />
                  ) : (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={value}
                          name={key}
                        />
                      }
                      label={msg(key)}
                      onChange={e => {
                        handleCheckbox(e, "equipment");
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </FormGroup>
        </Grid>
        <Divider sx={{ marginTop: 6 }} />
      </Box>
      <Box sx={{ width: "1000px" }}>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            marginBottom: 4,
            marginTop: 4,
            marginRight: 3,
            display: "inline-block"
          }}
        >
          {msg("adminPanelGallery")}
        </Typography>
        <Button
          variant="contained"
          component="label"
        >
          {msg("upload")}
          <input
            required
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={e => handleUploadButton(e)}
          />
        </Button>
        {errors.galleryToBeAdded !== "" && (
          <Typography
            variant="caption"
            component="h3"
            sx={{ color: "#d32f2f" }}
          >
            {msg("requiredGallery")}
          </Typography>
        )}
        {Object.keys(galleryToBeAdded).length !== 0 && (
          <>
            {Object.keys(params).length !== 0 && (
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{ marginTop: 4, marginBottom: 2 }}
              >
                {msg("toBeAddedGallery")}
              </Typography>
            )}
            <TableContainer
              sx={{ width: "400px", marginLeft: "auto", marginRight: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{msg("fileName")}</TableCell>
                    <TableCell>{msg("fileImage")}</TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(galleryToBeAdded).map(([key, value]) => {
                    return (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 }
                        }}
                      >
                        <TableCell>{value.name}</TableCell>
                        <TableCell>
                          <a
                            href={value.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={URL.createObjectURL(value)}
                              height="100px"
                              alt={value.name}
                            />
                          </a>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteButtonInTempGallery(key)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
        {Object.keys(params).length !== 0 && (
          <>
            {Object.keys(galleryToBeAdded).length !== 0 && (
              <Typography
                variant="subtitle1"
                component="h2"
                sx={{ marginTop: 4, marginBottom: 2 }}
              >
                {msg("currentGallery")}
              </Typography>
            )}
            <Placeholder
              status={params.id ? galleryQuery.status : "initial"}
              errorCode={
                params.id ? galleryQuery?.error?.response?.status : null
              }
            >
              <TableContainer
                sx={{ width: "400px", marginLeft: "auto", marginRight: "auto" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{msg("fileName")}</TableCell>
                      <TableCell>{msg("fileImage")}</TableCell>
                      <TableCell>&nbsp;</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(gallery).map(([key, value]) => {
                      return (
                        <TableRow
                          key={key}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 }
                          }}
                          className={
                            galleryToBeRemoved.some(el => el === value.id) &&
                            "rowToBeRemoved"
                          }
                        >
                          <TableCell> {value.name}</TableCell>
                          <TableCell>
                            <a
                              href={value.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={value.url}
                                height="100px"
                                alt={value.name}
                              />
                            </a>
                          </TableCell>
                          <TableCell>
                            {galleryToBeRemoved.includes(value.id) ? (
                              <IconButton
                                onClick={() =>
                                  handleCancelButtonInOriginalGallery(value.id)
                                }
                              >
                                <ClearIcon />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() =>
                                  handleDeleteButtonInOriginalGallery(value.id)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Placeholder>
          </>
        )}
        <Divider sx={{ marginTop: 6 }} />
      </Box>
    </>
  );
};

const Enum = {
  engineType: ["stationary", "outboard"],
  keelType: ["lifting", "full"],
  stereType: ["steeringWheel", "finOnRansom"]
};

export default YachtForm;
