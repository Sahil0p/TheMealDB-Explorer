// frontend/src/pages/RandomMeal.jsx
import { useState } from "react";
import API from "../api/api";
import MealCard from "../components/MealCard";
import PageFade from "../components/PageFade";
import toast from "react-hot-toast";

export default function RandomMeal() {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandom = () => {
    setLoading(true);
    API.get("/random")
      .then((res) => {
        const m = res.data.data.meals
          ? res.data.data.meals[0]
          : null;
        setMeal(m);
      })
      .catch(() => {
        toast.error("Failed to fetch random meal");
      })
      .finally(() => setLoading(false));
  };

  return (
    <PageFade>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Random Meal
        </h2>

        <button
          onClick={fetchRandom}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow hover:scale-105 transition"
        >
          I'm feeling hungry 😋
        </button>

        <div className="mt-6">
          {loading && (
            <p className="text-gray-600 dark:text-gray-300">
              Loading...
            </p>
          )}
          {meal && <MealCard meal={meal} />}
        </div>
      </div>
    </PageFade>
  );
}
