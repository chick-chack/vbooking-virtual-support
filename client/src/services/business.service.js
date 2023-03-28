import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/business/";

const getBusinessList = () => {
  return axios.get(SERVICE_BASE + "list");
};

const createBusiness = (data) => {
  return axios.post(SERVICE_BASE + "add", data);
};

const BusinessService = {
  getBusinessList,
  createBusiness,
};

export default BusinessService;
