import axios from "axios";

const AxiosClient = axios.create();
const token = localStorage.getItem("accessToken");

AxiosClient.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

AxiosClient.defaults.headers = {
  "Content-Type": "application/json; charset\u003dUTF-8",
  Authorization: token ? `Bearer ${token}` : null,
};

export default AxiosClient;
