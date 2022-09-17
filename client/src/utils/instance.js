import axios from "axios";

export const baseURL = process.env.REACT_APP_API_URL;

export const instance = axios.create({
  baseURL: `https://${baseURL}`,
  withCredentials: true,
});
