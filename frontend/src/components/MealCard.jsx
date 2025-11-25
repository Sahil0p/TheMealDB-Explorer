// frontend/src/components/MealCard.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useFavorites from "../hooks/useFavorites";
import toast from "react-hot-toast";

export default function MealCard({ meal, onUnfavorite }) {
  const { favorites, toggleFavorite } = useFavorites();
  const liked = favorites.some((f) => f.idMeal === meal.idMeal);

  const handleLike = (e) => {
    e.preventDefault();
    const result = toggleFavorite(meal);

    if (result.type === "added") {
      toast.success("Added to favorites ❤️");
    } else {
      toast("Removed from favorites 💔");

      // 🔥 Notify Favorites page so UI updates instantly
      if (typeof onUnfavorite === "function") {
        onUnfavorite(meal.idMeal);
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.18 }}
      className="relative"
    >
      <Link
        to={`/meal/${meal.idMeal}`}
        className="group block rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition border border-gray-200/60 dark:border-gray-700/60 hover:border-orange-400/80"
      >
        <div className="relative h-40 sm:h-48 overflow-hidden">

          {/* Meal Image */}
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Favorite Button */}
          <button
            onClick={handleLike}
            // className="absolute top-2 right-2 p-2 rounded-full text-lg backdrop-blur transition-transform bg-white/90 dark:bg-gray-900/80 hover:scale-110 border border-orange-400 shadow-[0_0_8px_rgba(255,125,0,0.5)] dark:border-orange-300 dark:shadow-[0_0_8px_rgba(255,150,50,0.6)]""
            className="absolute top-2 right-2 p-2 rounded-full bg-orange/80 backdrop-blur text-lg shadow-sm hover:scale-110 transition-transform"

          >
            {liked ? "❤️" : "🤍"}
          </button>

          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
              {meal.strMeal}
            </h3>
          </div>
        </div>

        {/* Meta */}
        <div className="p-3 flex items-center justify-between">
          {meal.strArea && (
            <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-[11px] font-medium">
              {meal.strArea}
            </span>
          )}

          <span className="text-xs font-medium text-orange-600 dark:text-orange-400 group-hover:translate-x-0.5 transition-transform">
            View recipe →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
