import axios from "axios";

// ⚠️ Cambia esta IP por la de tu PC (la misma que usás en Postman)
const API_URL = "http://192.168.1.101:3000";

export const createTransaction = async (payload) => {
  const res = await axios.post(`${API_URL}/transactions`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
