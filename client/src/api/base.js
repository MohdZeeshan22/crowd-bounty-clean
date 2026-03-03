import axios from "axios";

/* =========================
   BASE URL
========================= */
export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* =========================
   ATTACH TOKEN
========================= */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

/* =========================
   SANDBOX API
========================= */
export const runSandbox = (bugId) => {
  return API.post(`/company/sandbox/${bugId}`);
};