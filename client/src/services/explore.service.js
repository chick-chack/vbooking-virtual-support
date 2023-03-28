import axios from "axios";
import { API_BASE } from "./config";

const COMMON_BASE = API_BASE + "/common-unauth/";
const SERVICE_BASE = API_BASE + "/metaverse/";

const getCommonExploreList = ({ limit = 20, offset = 0, tag = "" }) => {
  return axios.get(
    COMMON_BASE + `explore?tag=${tag}&limit=${limit}&offset=${offset}`
  );
};

const getMyDimensions = ({ limit = 20, offset = 0 }) => {
  return axios.get(
    SERVICE_BASE + `my-dimension?limit=${limit}&offset=${offset}`
  );
};

const search = ({ limit = 20, offset = 0, serach = "" }) => {
  return axios.get(
    SERVICE_BASE + `search?searchKey=${serach}&limit=${limit}&offset=${offset}`
  );
};

const getExploreList = ({ limit = 20, offset = 0, tag = "" }) => {
  return axios.get(
    SERVICE_BASE + `explore?tag=${tag}&limit=${limit}&offset=${offset}`
  );
};

const ExploreService = {
  getCommonExploreList,
  getMyDimensions,
  getExploreList,
  search,
};

export default ExploreService;
