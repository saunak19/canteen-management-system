import axios from "axios";

export const getWeeklyMenus = () => axios.get("/api/menu/weekly");

export const setTenderPrices = (payload) =>
  axios.post("/api/hr/tender/set", payload);
