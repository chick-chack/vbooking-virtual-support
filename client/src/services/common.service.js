import axios from "axios";

import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/common";

const getUserList = (data) => {
  return axios
    .post(`${SERVICE_BASE}/user-data-list`, data)
    .then((res) => res.data.data);
};

const getPublicUserData = (userId) => {
  return axios
    .get(`${SERVICE_BASE}/user-data/${userId}`)
    .then((res) => res.data);
};

const uploadFile = (file) => {
  const formData = new FormData();
  formData.set("file", file);

  return axios
    .post(`${SERVICE_BASE}/upload-file`, formData, {
      headers: {
        "Content-Type": "Multipart/form-data",
      },
    })
    .then((res) => res.data);
};

const CommonService = {
  getUserList,
  getPublicUserData,
  uploadFile,
};

export default CommonService;
