import axios from "axios";
import { API_BASE } from "./config";

const SERVICE_BASE = API_BASE + "/checkout-payment";

const payWithToken = (data) => {
  return axios.post(`${SERVICE_BASE}/pay`, data);
};

const CheckoutService = {
  payWithToken,
};

export default CheckoutService;
