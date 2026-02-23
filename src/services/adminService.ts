import axios from "axios";

const API = "http://localhost:5000";

export const getAllProviders = async (token: string) => {
  const res = await axios.get(`${API}/admin/providers`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const verifyProvider = async (
  id: string,
  token: string
) => {
  const res = await axios.patch(
    `${API}/admin/verify/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};
