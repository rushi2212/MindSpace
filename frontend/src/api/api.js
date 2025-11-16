import axios from "axios";

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = "https://mindspace-r3fh.onrender.com/api";

const API = axios.create({ baseURL: API_BASE_URL });

export const sendMessage = (message) => API.post("/ai/chat", { message });
export const generateArt = (prompt) => API.post("/ai/art", { prompt });
export const generateAudio = (text, options = {}) =>
  API.post("/media/audio", {
    text,
    generate_content:
      options.generateContent !== undefined ? options.generateContent : true,
  });
export const generateMindMap = (topic) => API.post("/media/mindmap", { topic });
export const fetchTasks = (userId) => API.get(`/tasks/${userId}`);
// Expecting { title, user_id }
export const addTask = ({ title, user_id }) =>
  API.post("/tasks", { title, user_id });
// Send empty JSON body so FastAPI parses it and toggles when no fields provided
export const toggleTask = (id) => API.put(`/tasks/${id}`, {});
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
