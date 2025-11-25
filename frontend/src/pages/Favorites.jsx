// frontend/src/pages/Favorites.jsx
import { useEffect, useState } from "react";
import PageFade from "../components/PageFade";
import MealCard from "../components/MealCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  }, []);

  // 🔥 Remove favorite instantly
  const handleUnfavorite = (idMeal) => {
    const updated = favorites.filter((m) => m.idMeal !== idMeal);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const hasFavorites = favorites.length > 0;

  return (
    <PageFade>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              Your Favorites 🍽️
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              All the recipes you've ❤️ saved for later.
            </p>
          </div>
        </div>

        {/* Empty State */}
        {!hasFavorites ? (
          <div className="mt-10 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              No favorites yet
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-sm">
              Browse recipes and tap the ❤️ on any dish to add it here.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                onUnfavorite={handleUnfavorite}   // 🔥 important
              />
            ))}
          </div>
        )}
      </div>
    </PageFade>
  );
}
