import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import { addDays } from "date-fns";
import Slide from "@mui/material/Slide";

export const formatDate = date => {
  return moment(date).format("YYYY-MM-DD");
};

export const nullOrUndefined = item => {
  if (Array.isArray(item))
    return [
      item === undefined,
      item.includes(null),
      item.includes(undefined)
    ].some(Boolean);
  return [item === null, item === undefined].some(Boolean);
};

export const msg = id => {
  return <FormattedMessage id={id} />;
};

export const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatRangeToDatesList = res => {
  if (!res?.length || res === "null" || typeof res === "undefined") return [];
  let startDates = [],
    endDates = [],
    disabledDates = [];
  res.map(
    item => (
      startDates.push(new Date(item.startDate)),
      endDates.push(new Date(item.endDate))
    )
  );
  for (let i = 0; i < startDates.length; i++) {
    let currentDate = startDates[i];
    while (currentDate <= endDates[i]) {
      disabledDates.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
  }
  return disabledDates;
};

export const urlifyString = value => {
  return value.toLowerCase().replace(" ", "-");
};

export const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="up"
      ref={ref}
      {...props}
    />
  );
});

export const includesErrorStatuses = errorCode => {
  return [
    errorCode === 400,
    errorCode === 401,
    errorCode === 402,
    errorCode === 403,
    errorCode === 404,
    errorCode === 500
  ].some(Boolean);
};
