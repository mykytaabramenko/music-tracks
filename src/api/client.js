import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("Using API base URL:", apiBaseUrl);

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});
