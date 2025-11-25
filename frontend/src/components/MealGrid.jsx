// frontend/src/components/MealGrid.jsx
import MealCard from "./MealCard";

export default function MealGrid({ meals, visibleCount }) {
  if (!Array.isArray(meals)) return null;

  const limit = typeof visibleCount === "number" ? visibleCount : meals.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {meals.slice(0, limit).map((meal, index) => (
        <MealCard
          key={meal.idMeal || `${meal.strMeal || "meal"}-${index}`}
          meal={meal}
        />
      ))}
    </div>
  );
}
