import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { filterCardWidth } from "./common";
import { Context } from "../../../Wrapper";
import { msg } from "../../../utils/utils";

const FilterCard = ({ refetch, onSearch, models, filters, setFilters }) => {
  const context = useContext(Context);

  return (
    <Card
      data-test="filter-card"
      variant="outlined"
      sx={{ width: filterCardWidth, mr: 1, pt: 2, pl: 1, pr: 1 }}
    >
      <Autocomplete
        disablePortal
        options={models}
        onChange={async e => {
          await setFilters(prev => {
            return { ...prev, model: e.target.innerText };
          });
          await refetch();
        }}
        onClose={onSearch}
        noOptionsText={msg("noModels")}
        renderInput={params => (
          <TextField
            data-test={"filter-model"}
            {...params}
            label="Model"
          />
        )}
        sx={{ mb: 5 }}
      />
      <Box sx={{ mb: 5 }}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={context.locale === "pl-PL" ? "pl" : "en"}
        >
          <DatePicker
            label={msg("from")}
            value={filters.startDate}
            onChange={async startDate => {
              await setFilters(prev => {
                return {
                  ...prev,
                  startDate,
                  endDate: startDate === null ? null : prev.endDate
                };
              });
              await refetch();
            }}
            disablePast={true}
            renderInput={params => <TextField {...params} />}
            inputFormat="YYYY-MM-DD"
          />
        </LocalizationProvider>
      </Box>
      <Box sx={{ mb: 5 }}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={context.locale === "pl-PL" ? "pl" : "en"}
        >
          <DatePicker
            label={msg("to")}
            value={filters.endDate}
            onChange={async endDate => {
              await setFilters(prev => {
                return {
                  ...prev,
                  endDate: prev.startDate === null ? null : endDate
                };
              });
              await refetch();
            }}
            disablePast={true}
            renderInput={params => <TextField {...params} />}
            inputFormat="YYYY-MM-DD"
            disabled={!filters.startDate}
            shouldDisableDate={day => {
              return day < filters.startDate;
            }}
          />
        </LocalizationProvider>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="select">{msg("maxPrice")}</InputLabel>
        <Select
          labelId="select"
          value={filters.maxPrice}
          label="Price"
          onChange={async e => {
            await setFilters(prev => {
              return { ...prev, maxPrice: parseFloat(e.target.value) };
            });
            await refetch();
          }}
        >
          {prices.map(price => {
            return (
              <MenuItem
                value={price}
                key={price}
              >
                {price} zł
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Card>
  );
};

export default FilterCard;

const prices = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
