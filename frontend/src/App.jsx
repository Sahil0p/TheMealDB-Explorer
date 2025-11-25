// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Categories from "./pages/Categories";
import RandomMeal from "./pages/RandomMeal";
import MealDetails from "./pages/MealDetails";
import Favorites from "./pages/Favorites";
import CategoryMeals from "./pages/CategoryMeals";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition">
      <Navbar />
      <main className="pt-4 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:name" element={<CategoryMeals />} />
          <Route path="/random" element={<RandomMeal />} />
          <Route path="/meal/:id" element={<MealDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}
