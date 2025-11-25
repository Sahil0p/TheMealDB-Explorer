// frontend/src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/meals",
  timeout: 8000,
});

// --- ENDPOINT WRAPPERS --- //

// FIXED → use q instead of name
export const searchMeals = (query) =>
  API.get(`/search?q=${encodeURIComponent(query)}`);

export const getCategories = () => API.get(`/categories`);

export const getMealsByCategory = (cat) =>
  API.get(`/category/${encodeURIComponent(cat)}`);

export const getMealDetails = (id) => API.get(`/details/${id}`);

export const getRandomMeal = () => API.get(`/random`);

API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

export default API;
