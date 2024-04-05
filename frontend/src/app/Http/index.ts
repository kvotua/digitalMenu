import axios from "axios";
import { Cookies } from "react-cookie";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const cookie = new Cookies();
export const apiWithAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    token: cookie.get("userToken"),
  },
});