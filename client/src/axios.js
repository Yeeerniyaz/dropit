import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.43.252:5000",
});

instance.interceptors.request.use((config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export default instance;
