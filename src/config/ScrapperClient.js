import AxiosClient from "./AxiosClient";

const ApiAxiosClient = AxiosClient.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  "Content-Type": "application/json",
});

export default ApiAxiosClient;
