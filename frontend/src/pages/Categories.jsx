// frontend/src/pages/Categories.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      const list = res.data.data.categories || [];
      setCategories(list);
    } catch (e) {
      console.error("Category load error:", e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* PAGE HEADING */}
      <h1 className="text-3xl font-bold mb-8 text-orange-500 dark:text-orange-400">
        🍽️ Explore Categories
      </h1>

      {/* LOADING STATE */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {/* CATEGORY CARDS */}
          {categories.map((cat) => (
            <div
              key={cat.idCategory}
              onClick={() => navigate(`/category/${cat.strCategory}`)}
              className="
                group relative rounded-2xl overflow-hidden 
                shadow-md bg-gray-100 dark:bg-gray-800 
                border border-gray-300 dark:border-gray-700
                cursor-pointer transition transform 
                hover:-translate-y-2 hover:shadow-2xl hover:border-orange-500
              "
            >
              {/* CATEGORY THUMBNAIL */}
              <img
                src={cat.strCategoryThumb}
                alt={cat.strCategory}
                className="
                  w-full h-40 object-cover 
                  transition-transform duration-500 group-hover:scale-110
                "
              />

              {/* DARK GRADIENT OVERLAY */}
              <div
                className="
                  absolute inset-0 
                  bg-gradient-to-t 
                  from-black/70 via-black/40 to-transparent
                "
              />

              {/* CATEGORY TITLE */}
              <h3
                className="
                  absolute bottom-3 left-1/2 -translate-x-1/2 
                  text-gray-100 dark:text-white 
                  font-semibold text-lg tracking-wide drop-shadow-lg
                "
              >
                {cat.strCategory}
              </h3>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}
