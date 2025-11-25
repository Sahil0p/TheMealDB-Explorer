// frontend/src/pages/CategoryMeals.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import MealCard from "../components/MealCard";
import SkeletonCard from "../components/SkeletonCard";

export default function CategoryMeals() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeals();
  }, [name]);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/category/${name}`);
      const list = res.data.data.meals || [];
      setMeals(list);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/categories")}
        className="
          inline-flex items-center gap-2 px-4 py-2 mb-6
          bg-orange-600 text-white rounded-full
          shadow hover:bg-orange-500 active:scale-95
          transition
        "
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-4">
        {name} Recipes 🍽️
      </h1>

      {/* SUB-TEXT */}
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Showing all delicious{" "}
        <span className="font-semibold text-orange-600 dark:text-orange-400">
          {name}
        </span>{" "}
        dishes.
      </p>

      {/* MEAL GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : meals.map((m) => <MealCard key={m.idMeal} meal={m} />)}
      </div>
    </div>
  );
}

