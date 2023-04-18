import axios from "axios";

axios.defaults.withCredentials = true;
// axios.defaults.headers.authorization =
//   localStorage.getItem("vverse-token") || "";

export const API_BASE =
  "https://portal.chickchack.net:7005/api/v6/customer-dashboard";
// export const API_BASE = "https://api.vbooking.ai/v1/";
