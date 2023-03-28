import { notification } from "antd";

export const axiosCatch = (error) => {
  notification.error({
    message:
      error?.response?.data?.message ||
      error?.response?.data?.msg ||
      error.message,
  });
};
