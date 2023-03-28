import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/metaverse/";

const getMyDimensions = () => {
  return axios.get(SERVICE_BASE + "my-dimension", {
    params: { limit: 100, offset: 0 },
  });
};

const addDimension = (data) => {
  return axios.post(SERVICE_BASE + "add-dimension", data);
};

const deleteDimension = (id) => {
  return axios.delete(SERVICE_BASE + `delete-dimension/${id}`);
};

const renameDimension = (id, data) => {
  return axios.put(SERVICE_BASE + `rename-dimension/${id}`, data);
};

const MetaverseService = {
  addDimension,
  deleteDimension,
  renameDimension,
  getMyDimensions,
};

export default MetaverseService;
