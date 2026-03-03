import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  return API.post("/auth/login", {
    email,
    password,
  });
};
