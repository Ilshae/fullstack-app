import { API, API_WITH_TOKEN } from "./http.common";

export const getReservationsByYachtId = yachtId => {
  return API.get(`/reservations?yachtId=${yachtId}`).then(res => res.data);
};

export const getDisabledDatesByYachtId = yachtId => {
  return API.get(`/disabledDates?yachtId=${yachtId}`).then(res => res.data);
};

export const getReservation = id => {
  return API.get(`/reservations/${id}`).then(res => res.data);
};

export const createReservation = data => {
  return API.post("/reservations", data).then(res => res.data);
};

export const createReservationAdminPanel = data => {
  return API_WITH_TOKEN.post("/addreservation", data).then(res => res.data);
};

export const updateReservation = (id, data) => {
  return API_WITH_TOKEN.put(`/reservations/${id}`, data).then(res => res.data);
};

export const deleteReservation = id => {
  return API_WITH_TOKEN.delete(`/reservations/${id}`).then(res => res.data);
};

export const deleteReservationsByYachtId = yachtId => {
  return API_WITH_TOKEN.delete(`/reservations?yachtId=${yachtId}`);
};

export const getYachtNameByResId = id => {
  return API.get(`/reservations/yachtName?id=${id}`).then(res => res.data);
};
