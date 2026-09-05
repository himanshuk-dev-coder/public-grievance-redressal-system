import api from "./API.js";

export const fetchMinistries = () => api.get("/ministries");

export const submitComplaint = async (complaintData) => {
  return api.post("/complaints", complaintData);
};




