// frontend/src/components/SearchBar.jsx
import { useEffect, useState } from "react";
import API from "../api/api";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";

export default function SearchBar({ onResults }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      onResults?.([]);
      return;
    }

    setLoading(true);

    API.get(`/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => {
        const meals = res.data.data.meals || [];

        setSuggestions(meals.slice(0, 5));
        onResults?.(meals);

        localStorage.setItem("lastMeals", JSON.stringify(meals));
      })
      .catch(() => {
        toast.error("Search failed. Using cached results if available.");

        const cached = localStorage.getItem("lastMeals");
        if (cached) {
          try {
            onResults?.(JSON.parse(cached));
          } catch {
            onResults?.([]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]); // ← FIXED: remove onResults from deps

  const handleSuggestionClick = (name) => {
    setQuery(name);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search for a recipe..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl px-5 py-3 border 
        border-gray-300 dark:border-gray-700 
        bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 
        shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
      />

      {loading && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          Searching...
        </span>
      )}

      {suggestions.length > 0 && (
        <div className="absolute mt-2 w-full bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg 
        z-20 max-h-64 overflow-y-auto">
          {suggestions.map((meal) => (
            <button
              key={meal.idMeal}
              onClick={() => handleSuggestionClick(meal.strMeal)}
              className="w-full text-left px-4 py-2 text-sm 
              hover:bg-gray-100 dark:hover:bg-gray-700 
              text-gray-800 dark:text-gray-200"
            >
              {meal.strMeal}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
