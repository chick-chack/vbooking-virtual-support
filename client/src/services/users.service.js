import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/personal/profile/";

const getUser = () => {
  return axios.get(SERVICE_BASE + "get");
};

const updateInformation = (data) => {
  return axios.put(SERVICE_BASE + "update-information/", data);
};

const updateUserPassword = (password) => {
  return axios.put(SERVICE_BASE + "update-password/", { password });
};

const updateImage = (file) => {
  const formData = new FormData();
  formData.set("profileImage", file);
  return axios.put(SERVICE_BASE + "update-image/", formData);
};

const UsersService = {
  getUser,
  updateUserPassword,
  updateInformation,
  updateImage,
};

export default UsersService;
