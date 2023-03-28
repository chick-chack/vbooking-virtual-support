import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/auth/";

const getAuth = () => {
  return axios.get(SERVICE_BASE + "me");
};

const login = (data) => {
  return axios.post(SERVICE_BASE + "login", data);
};

const loginWithGoogle = (data) => {
  return axios.post(SERVICE_BASE + "login-google", data);
};

const loginWithFacebook = (data) => {
  return axios.post(SERVICE_BASE + "login-facebook", data);
};

const signup = (data) => {
  return axios.post(SERVICE_BASE + "signup", data);
};

const logout = () => {
  return axios.get(SERVICE_BASE + "logout");
};

const forgetPassword = (email) => {
  return axios.post(SERVICE_BASE + "forget-password", email);
};

const verifyForgetPassword = (data) => {
  return axios.put(SERVICE_BASE + "verify-forget-password", data);
};

const AuthService = {
  getAuth,
  login,
  loginWithGoogle,
  loginWithFacebook,
  logout,
  signup,
  forgetPassword,
  verifyForgetPassword,
};

export default AuthService;
