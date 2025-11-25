// frontend/src/pages/MealDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import PageFade from "../components/PageFade";

export default function MealDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [meal, setMeal] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    API.get(`/details/${id}`).then((res) => {
      const data = res.data.data.meals?.[0];
      setMeal(data);
    });
  }, [id]);

  if (!meal) {
    return (
      <p className="text-center mt-8 text-gray-600 dark:text-gray-300">
        Loading meal details...
      </p>
    );
  }

  // Build ingredients list
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${ing} - ${measure || ""}`.trim());
  }

  const youtubeId = meal.strYoutube
    ? meal.strYoutube.split("v=")[1]
    : null;

  return (
    <PageFade>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="
            inline-flex items-center gap-2 px-4 py-2 mb-4
            bg-orange-600 text-white rounded-full
            shadow hover:bg-orange-500 active:scale-95
            transition
          "
        >
          ← Back
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md 
          overflow-hidden border border-gray-200/60 dark:border-gray-800/60 w-full">

          {/* IMAGE with hover zoom + click to enlarge */}
          <div
            className="cursor-pointer relative group"
            onClick={() => setShowImage(true)}
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="
                w-full max-h-[600px] object-cover
                transition-transform duration-500 
                group-hover:scale-105
              "
            />

            {/* Hover overlay */}
            <div className="
              absolute inset-0 bg-black/20 
              opacity-0 group-hover:opacity-100 
              transition
            "></div>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Title & meta */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {meal.strMeal}
                </h1>

                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {meal.strCategory && (
                    <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 font-medium">
                      {meal.strCategory}
                    </span>
                  )}
                  {meal.strArea && (
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                      {meal.strArea}
                    </span>
                  )}
                  {meal.strTags && (
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs">
                      {meal.strTags}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-gray-100">
              Ingredients
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {ingredients.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-800 dark:text-gray-200"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Instructions */}
            <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-gray-100">
              Instructions
            </h2>

            <p className="leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm sm:text-base">
              {meal.strInstructions}
            </p>

            {/* Video */}
            {youtubeId && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Video Tutorial
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    className="w-full h-full"
                    allowFullScreen
                    title="Meal tutorial"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE POPUP */}
      {showImage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowImage(false)}
        >
          <img
            src={meal.strMealThumb}
            alt="Full view"
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </PageFade>
  );
}
