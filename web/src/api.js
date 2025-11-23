import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001", 
});

export async function ping() {
  try {
    const res = await api.get("/ping");
    return res.data;
  } catch (err) {
    console.error("Ping failed:", err.message);
    return null;
  }
}
