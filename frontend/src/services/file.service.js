import { API, API_WITH_TOKEN } from "./http.common";

export const uploadFilesToBackend = (file, yachtId) => {
  let formData = new FormData();
  formData.append("file", file);

  if (yachtId) {
    return API_WITH_TOKEN.post(`/upload?yachtId=${yachtId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }

  return API_WITH_TOKEN.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getFilesByYachtId = yachtId => {
  return API.get(`/files?yachtId=${yachtId}`).then(res => res.data);
};

export const getFirstFileByYachtId = yachtId => {
  return API.get(`/firstFile?yachtId=${yachtId}`);
};

export const deleteByFileId = id => {
  return API_WITH_TOKEN.delete(`/files/${id}`);
};
