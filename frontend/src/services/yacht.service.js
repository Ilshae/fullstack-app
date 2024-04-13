import { API, API_WITH_TOKEN } from "./http.common";

export const getYachts = () => {
  return API.get("/yachts").then(res => res.data);
};

export const getModels = () => {
  return API.get("/models").then(res => res.data);
};

export const getYacht = id => {
  return API.get(`/yachts/${id}`).then(res => res.data);
};

export const createYacht = data => {
  return API_WITH_TOKEN.post("/yachts", data).then(res => res.data);
};

export const updateYacht = (id, data) => {
  return API_WITH_TOKEN.put(`/yachts/${id}`, data);
};

export const deleteYacht = id => {
  return API_WITH_TOKEN.delete(`/yachts/${id}`);
};

export const getYachtsFilter = data => {
  return API.post("/yachtsFilter", data).then(res => res.data);
};

export const getYachtByUrl = url => {
  return API.get(`/yacht?url=${url}`).then(res => res.data);
};

export const getYachtName = id => {
  return API.get(`/yachtName?id=${id}`).then(res => res.data);
};
