import { API_AUTH } from "./http.common";

export const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "http://localhost:3000";
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getUser = id => {
  return API_AUTH.get(`/user/${id}`).then(res => res.data);
};

export const getUsers = () => {
  return API_AUTH.get("/users").then(res => res.data);
};

export const getAdminContent = () => {
  return API_AUTH.get("/admin-panel");
};

export const updateUser = (id, data) => {
  return API_AUTH.put(`/user/${id}`, data).then(res => res.data);
};

export const login = (username, password) => {
  return API_AUTH.post("/signin", {
    username,
    password
  }).then(response => {
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};

export const register = userData => {
  return API_AUTH.post("/signup", {
    ...userData
  }).then(res => res.data);
};

export const resetPassword = (id, password) => {
  return API_AUTH.put(`/user/reset-password/${id}`, password);
};

export const deleteUser = id => {
  return API_AUTH.delete(`/users/${id}`);
};
