import axios from "axios";

/* =========================
   AXIOS BASE INSTANCE
========================= */
export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* =========================
   Attach Token Automatically
========================= */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

/* =========================
   Submit Bug
========================= */
export const submitBug = (data) => {
  return API.post("/bugs/submit", data);
};

/* =========================
   Run Sandbox  ✅ FIXED
========================= */
export const runSandbox = (id) => {
  return API.post(`/company/sandbox/${id}`);
};

/* =========================
   Get Company Analytics
========================= */
export const getCompanyAnalytics = () => {
  return API.get("/company/analytics");
};

/* =========================
   Get Company Wallet
========================= */
export const getCompanyWallet = () => {
  return API.get("/company/wallet");
};