import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.authorization =
  // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoidXNlciIsInJvbGUiOiJ1c2VyIiwiaWQiOjEsImlhdCI6MTY3NzQyNDExOH0.5l9eq_9CJmInFGFj7daeUS7Ytj46AozzAmoBPeHHlps";
  localStorage.getItem("vverse-token") || "";

export const API_BASE =
  "https://portal.chickchack.net:7005/api/v6/customer-dashboard";
// export const API_BASE = "https://api.vbooking.ai/v1/";
