import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const sendMessage = (message) => API.post("/ai/chat", { message });
export const generateArt = (prompt) => API.post("/ai/art", { prompt });
export const fetchTasks = (userId) => API.get(`/tasks/${userId}`);
// Expecting { title, user_id }
export const addTask = ({ title, user_id }) =>
  API.post("/tasks", { title, user_id });
// Send empty JSON body so FastAPI parses it and toggles when no fields provided
export const toggleTask = (id) => API.put(`/tasks/${id}`, {});
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
