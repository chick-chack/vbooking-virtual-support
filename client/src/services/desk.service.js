import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/desk/";

const addDesk = (data) => {
  return axios.post(SERVICE_BASE + "add", data);
};

const listDesks = (dimensionId) => {
  return axios.get(SERVICE_BASE + `list/${dimensionId}`);
};

const getMyDesks = () => {
  return axios.get(SERVICE_BASE + "get-my-desks");
};

const getDeskInfo = (meetingId) => {
  return axios.get(SERVICE_BASE + `get-desk-info/${meetingId}`);
};

const editDesk = (data) => {
  return axios.put(SERVICE_BASE + "edit", data);
};

const DeskService = {
  addDesk,
  listDesks,
  getMyDesks,
  getDeskInfo,
  editDesk,
};

export default DeskService;
