import axios from "axios";

const API = "https://handio.onrender.com/api";

export const fetchProviders = async (filters: {
  category: string;
  city: string;
  area: string;
}) => {
  const res = await axios.get(`${API}/providers`, {
    params: filters,
  });

  return res.data;
};

export const fetchProviderById = async (id: string) => {
  const res = await axios.get(`${API}/providers/${id}`);
  return res.data;
};
