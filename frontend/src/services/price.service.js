import { API, API_WITH_TOKEN } from "./http.common";

export const getPricesByYachtId = yachtId => {
  return API.get(`prices?yachtId=${yachtId}`).then(res => res.data);
};

export const getPrice = id => {
  return API.get(`/prices/${id}`).then(res => res.data);
};

export const getCharterPrice = data => {
  return API.post("/charterPrice", data).then(res => res.data);
};

export const createPrice = data => {
  return API_WITH_TOKEN.post("/prices", data);
};

export const updatePrice = (id, data) => {
  return API_WITH_TOKEN.put(`/prices/${id}`, data);
};

export const deletePrice = id => {
  return API_WITH_TOKEN.delete(`/prices/${id}`);
};

export const deletePricesByYachtId = yachtId => {
  return API_WITH_TOKEN.delete(`/prices?yachtId=${yachtId}`);
};

export const getYachtNameByPriceId = id => {
  return API.get(`/prices/yachtName?id=${id}`).then(res => res.data);
};
