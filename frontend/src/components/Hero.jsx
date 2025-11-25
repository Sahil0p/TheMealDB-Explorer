// frontend/src/components/Hero.jsx
import { useState, useEffect, useRef } from "react";
import API from "../api/api";

export default function Hero({ onSearch, onRandom }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const containerRef = useRef(null);

  const scrollToAllRecipes = () => {
    const el = document.getElementById("all-recipes-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!q.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(() => {
      API.get(`/search?q=${encodeURIComponent(q)}`)
        .then((r) => {
          const meals = r.data.data.meals || [];
          setSuggestions(meals.slice(0, 20));
          setShow(true);
        })
        .catch(() => setSuggestions([]));
    }, 250);

    return () => clearTimeout(delay);
  }, [q]);

  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setShow(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <section
      ref={containerRef}
      className="rounded-xl bg-gradient-to-r from-orange-600 to-red-500 text-white p-8 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6 relative">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">What would you like to cook today?</h1>
            <p className="text-sm opacity-90 mt-1">Search from thousands of recipes</p>
          </div>

          <button
            onClick={() => {
              onRandom();
              scrollToAllRecipes();
            }}
            className="hidden sm:block bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md"
          >
            Happy Eating 🍽️
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-full">
          <div className="bg-white rounded-full p-2 shadow-sm flex items-center gap-2 sm:gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShow(true)}
              onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
              placeholder="Search recipes..."
              className="flex-1 px-4 py-3 rounded-full outline-none text-gray-800"
            />

            <button
              onClick={() => onSearch(q)}
              className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-full text-sm sm:text-base"
            >
              Search
            </button>

            <button
              onClick={onRandom}
              className="hidden sm:inline bg-white/10 px-3 py-2 rounded-full"
            >
              🎲
            </button>
          </div>

          {/* suggestions */}
          {show && suggestions.length > 0 && (
            <div className="mt-2 w-full bg-white text-gray-800 rounded-xl shadow-lg border overflow-y-auto max-h-64">
              {suggestions.map((meal) => (
                <div
                  key={meal.idMeal}
                  onClick={() => {
                    onSearch(meal.strMeal);
                    setShow(false);
                    setQ(meal.strMeal);
                    scrollToAllRecipes();
                  }}
                  className="flex gap-3 items-center px-4 py-3 cursor-pointer hover:bg-gray-100"
                >
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="font-medium">{meal.strMeal}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* mobile button */}
        <button
          onClick={() => {
            onRandom();
            scrollToAllRecipes();
          }}
          className="block sm:hidden bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md"
        >
          Happy Eating 🍽️
        </button>
      </div>
    </section>
  );
}
