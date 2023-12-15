import AxiosClient from "./AxiosClient";

const ApiAxiosClient = AxiosClient.create({
  baseURL: process.env.REACT_APP_API_URL,
  "Content-Type": "application/json; charset\u003dUTF-8",
});

export default ApiAxiosClient;
