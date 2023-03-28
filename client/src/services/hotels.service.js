import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "web/hotels/";

const getCountryList = () => {
  return axios.get(SERVICE_BASE + "get-country-list");
};

const getCityList = (data) => {
  return axios.post(SERVICE_BASE + "get-city-list", data);
};

const getHotelsDetails = (data) => {
  return axios.post(SERVICE_BASE + "get-hotels-details", data);
};

const searchRoom = (data) => {
  return axios.post(SERVICE_BASE + "search-room", data);
};

const HotelsService = {
  getCountryList,
  getCityList,
  getHotelsDetails,
  searchRoom,
};

export default HotelsService;
