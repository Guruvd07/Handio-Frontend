import axios from "axios";

const API = "http://localhost:5000";

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${API}/auth/login`, {
    email,
    password,
  });

  return res.data;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const res = await axios.post(`${API}/auth/register`, {
    name,
    email,
    password,
    role,
  });

  return res.data;
};
