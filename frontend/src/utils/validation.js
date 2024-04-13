import { msg } from "./utils";

export const validateYachtData = (yachtData, isCreatePage) => {
  const { yacht, technicalData, equipment, galleryToBeAdded } = yachtData;
  let temp = {
    yacht: {},
    technicalData: {},
    equipment: {},
    galleryToBeAdded: {}
  };
  temp.yacht.model = regularValidation(yacht, "model");
  temp.yacht.modelNumber = regularValidation(yacht, "modelNumber");
  temp.yacht.name = regularValidation(yacht, "name");
  temp.yacht.people = mustBeInteger(yacht, "people");
  temp.yacht.year = mustBeInteger(yacht, "year");
  temp.technicalData.length = mustBeNumber(technicalData, "length");
  temp.technicalData.width = mustBeNumber(technicalData, "width");
  temp.technicalData.height = mustBeNumber(technicalData, "height");
  temp.technicalData.engineType = regularValidation(
    technicalData,
    "engineType"
  );
  temp.technicalData.engineManufacturer = regularValidation(
    technicalData,
    "engineManufacturer"
  );
  temp.technicalData.enginePower = mustBeNumber(technicalData, "enginePower");
  temp.technicalData.depth = regularValidation(technicalData, "depth");
  temp.technicalData.mass = mustBeNumber(technicalData, "mass");
  temp.technicalData.bottomBalast = mustBeNumber(technicalData, "bottomBalast");
  temp.technicalData.sailsSurface = mustBeNumber(technicalData, "sailsSurface");
  temp.technicalData.keelType = regularValidation(technicalData, "keelType");
  temp.technicalData.keelWeight = mustBeNumber(technicalData, "keelWeight");
  temp.technicalData.stereType = regularValidation(technicalData, "stereType");
  temp.equipment.other = notReqValidation(equipment, "other");
  temp.galleryToBeAdded = mustHaveGallery(galleryToBeAdded, isCreatePage);
  return temp;
};

export const validateReservationData = (
  reservationData,
  selectedDates = null
) => {
  const { reservation, client } = reservationData;
  let temp = {
    reservation: {},
    client: {}
  };
  temp.reservation.price = mustBeNumber(reservation, "price");
  temp.reservation.message = notReqValidation(reservation, "message");
  temp.reservation.from = "";
  temp.reservation.to = "";
  if (selectedDates === null) {
    temp.reservation.from = mustBeDate(reservation, "from");
    temp.reservation.to = mustBeDate(reservation, "to");
  } else {
    temp.reservation.from = !selectedDates.startDate
      ? msg("requiredCalendarField")
      : isNaN(selectedDates.startDate)
      ? msg("requiredCalendarField")
      : "";

    temp.reservation.to = !selectedDates.endDate
      ? msg("requiredCalendarField")
      : isNaN(selectedDates.endDate)
      ? msg("requiredCalendarField")
      : "";
  }
  temp.client.firstname = regularValidation(client, "firstname");
  temp.client.lastname = regularValidation(client, "lastname");
  temp.client.email = mustBeEmail(client, "email");
  temp.client.phoneNumber = mustBePhoneNumber(client, "phoneNumber");
  temp.client.patentNumber = regularValidation(client, "patentNumber");
  temp.client.postCode = regularValidation(client, "postCode");
  temp.client.street = regularValidation(client, "street");
  temp.client.streetNumber = regularValidation(client, "streetNumber");
  temp.client.city = regularValidation(client, "city");
  return temp;
};

export const validatePriceData = priceData => {
  let temp = {
    priceData: {}
  };
  temp.priceData.price = mustBeNumber(priceData, "price");
  temp.priceData.date = mustBeDate(priceData, "date");
  return temp;
};

export const validateUserData = (userData, params) => {
  let temp = {
    userData: {}
  };
  temp.userData.username = regularValidation(userData, "username");
  if (!params.id)
    temp.userData.password = mustBeValidPassword(userData, "password");
  temp.userData.email = mustBeEmail(userData, "email");
  temp.userData.roles = mustBeArray(userData, "roles");
  return temp;
};

export const validatePasswordReset = password => {
  return !password
    ? msg("requiredField")
    : containsIllegalChars(password)
    ? msg("illegalChars")
    : !isMinLength(password, 6)
    ? msg("invalidPassword")
    : "";
};

const notReqValidation = (field, key) => {
  return containsIllegalChars(field[key]) ? msg("illegalChars") : "";
};

const regularValidation = (field, key) => {
  return !field[key]
    ? msg("requiredField")
    : containsIllegalChars(field[key])
    ? msg("illegalChars")
    : "";
};

const mustBeInteger = (field, key) => {
  return !field[key]
    ? msg("requiredField")
    : containsIllegalChars(field[key])
    ? msg("illegalChars")
    : !containsOnlyIntegers(field[key])
    ? msg("mustBeIntegerGreaterThan0")
    : "";
};

const mustBeNumber = (field, key) => {
  return !field[key]
    ? msg("requiredField")
    : containsIllegalChars(field[key])
    ? msg("illegalChars")
    : !containsOnlyNumbers(field[key])
    ? msg("mustBeGreaterThan0")
    : "";
};

const mustHaveGallery = (gallery, isCreatePage) => {
  if (isCreatePage && Object.keys(gallery).length === 0)
    return msg("requiredGallery");
  return "";
};

const mustBeDate = (field, key) => {
  return !field[key]
    ? msg("requiredField")
    : containsIllegalChars(field[key])
    ? msg("illegalChars")
    : !isValidDate(field[key])
    ? msg("mustBeDate")
    : "";
};

const mustBeEmail = (field, key) => {
  return !field[key]
    ? msg("requiredField")
    : containsIllegalChars(field[key])
    ? msg("illegalChars")
    : !isValidEmail(field[key])
    ? msg("invalidEmail")
    : "";
};

const mustBePhoneNumber = (field, key) => {
  return !field[key]
    ? msg("requiredField")
    : containsIllegalChars(field[key])
    ? msg("illegalChars")
    : !isValidPhoneNumber(field[key])
    ? msg("invalidPhoneNumber")
    : "";
};

const mustBeArray = (field, key) => {
  return !field[key]?.length ? msg("requiredField") : "";
};

const mustBeValidPassword = (field, key) => {
  return !field[key]
    ? msg("requiredField")
    : containsIllegalChars(field[key])
    ? msg("illegalChars")
    : !isMinLength(field[key], 6)
    ? msg("invalidPassword")
    : "";
};

//eslint-disable-next-line
const illegalChars = ["`", "!", ";", '"', "'", ",", "\u00b4"];
export const containsIllegalChars = value => {
  const chars = illegalChars.join("");
  const regex = new RegExp(`[${chars}]`);
  return regex.test(value);
};

export const containsOnlyIntegers = value => {
  const regex = new RegExp("^[1-9][0-9]*$");
  return regex.test(value);
};

export const containsOnlyNumbers = value => {
  const regex = new RegExp("^\\d*\\.\\d{1,2}$");
  return !!(containsOnlyIntegers(value) || regex.test(value));
};

export const isValidDate = value => {
  const regex = new RegExp("^\\d\\d\\d\\d-\\d\\d-\\d\\d$");
  return regex.test(value);
};

const isValidEmail = value => {
  return value.match(
    /* eslint-disable-next-line no-useless-escape */
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const isMinLength = (value, length) => {
  return value.length >= length;
};

const isValidPhoneNumber = value => {
  return isMinLength(value, 9) && containsOnlyIntegers(value);
};
