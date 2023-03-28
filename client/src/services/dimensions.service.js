import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/rental-space/";

const getListForRent = () => {
  return axios.get(SERVICE_BASE + "list-for-rent");
};

const getMyList = () => {
  return axios.get(SERVICE_BASE + "my/list");
};

const rentSpace = (data) => {
  return axios.post(SERVICE_BASE + "rent-space", data);
};

const DimensionsService = {
  getListForRent,
  getMyList,
  rentSpace,
};

export default DimensionsService;
