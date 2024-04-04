import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const apiWithAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    token: localStorage.getItem("token"),
  },
});
