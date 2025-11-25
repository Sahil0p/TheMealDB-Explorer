// frontend/src/hooks/useFavorites.js
import { useEffect, useState } from "react";

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const save = (items) => {
    setFavorites(items);
    localStorage.setItem("favorites", JSON.stringify(items));
  };

  const toggleFavorite = (meal) => {
    const exists = favorites.find((f) => f.idMeal === meal.idMeal);
    if (exists) {
      const updated = favorites.filter((f) => f.idMeal !== meal.idMeal);
      save(updated);
      return { type: "removed", meal };
    } else {
      const updated = [...favorites, meal];
      save(updated);
      return { type: "added", meal };
    }
  };

  return { favorites, toggleFavorite };
}
