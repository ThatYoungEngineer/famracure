import axios from "axios";
import { get } from "./Services/LocalStorageService";

const axiosClient = axios.create({
  baseURL: "https://backend.famracure.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

axiosClient.interceptors.request.use((config) => {
  let token;
  if (get("TOKEN_USER")) {
    token = get("TOKEN_USER");
  } else if (get("TOKEN_DOCTOR")) {
    token = get("TOKEN_DOCTOR");
  } else if (get("TOKEN_ADMIN")) {
    token = get("TOKEN_ADMIN");
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
