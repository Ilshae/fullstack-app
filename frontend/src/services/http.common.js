import axios from "axios";

const user = JSON.parse(localStorage.getItem("user"));

const authHeaders = () => {
  if (user && user.accessToken) {
    return { Authorization: "Bearer " + user.accessToken };
  } else {
    return {};
  }
};

export const API = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-type": "application/json" }
});

export const API_WITH_TOKEN = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: authHeaders()
});

export const API_AUTH = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  headers: authHeaders()
});
