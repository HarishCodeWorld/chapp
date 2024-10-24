import { message } from "antd";
import axios from "axios";

export const baseURL = "https://chat-app-be-3jab.onrender.com";
// export const baseURL = "http://localhost:3030";

const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (
      response
      // &&
      // (response.status === 400 ||
      //   response.status === 401 ||
      //   response.status === 403)
    ) {
      const status = response.status;
      if (status === 404) {
        // message.error("User Not Found!");
      } else if (status === 400) {
        // message.warning("Password incorrect!");
      } else if (status === 403 || status === 401) {
        message.info("Session Expired!...Redirecting you to Login page");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
