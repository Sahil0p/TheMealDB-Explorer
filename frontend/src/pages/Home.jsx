// frontend/src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import API, { getCategories, getMealsByCategory } from "../api/api";

import CategoryChips from "../components/CategoryChips";
import MealCard from "../components/MealCard";
import MealGrid from "../components/MealGrid";
import SkeletonCard from "../components/SkeletonCard";
import PageFade from "../components/PageFade";
import Hero from "../components/Hero";
import SectionHeader from "../components/SectionHeader";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

export default function Home() {
  // -----------------------------
  // STATE
  // -----------------------------
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [randomMeals, setRandomMeals] = useState([]);

  const [loadingMeals, setLoadingMeals] = useState(true);
  const [loadingRandom, setLoadingRandom] = useState(true);

  const [activeCategory, setActiveCategory] = useState(null);

  const randomScrollRef = useRef(null);

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    initLoad();
  }, []);

  useEffect(() => {
    window.onHomeReset = () => {
      resetHomeContent();
    };
  }, []);

  const initLoad = async () => {
    await Promise.all([loadCategories(), loadAllMeals(), loadRandomMeals()]);
  };

  const resetHomeContent = async () => {
    setActiveCategory(null);
    await loadAllMeals();
    await loadRandomMeals();
    scrollToTop();
  };

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  // -----------------------------
  // LOADERS
  // -----------------------------
  const loadCategories = async () => {
    try {
      const res = await getCategories();
      const list = res.data?.data?.categories || [];
      setCategories(list);
      localStorage.setItem("categories", JSON.stringify(list));
    } catch {
      const cached = localStorage.getItem("categories");
      if (cached) setCategories(JSON.parse(cached));
    }
  };

  const loadAllMeals = async () => {
    setLoadingMeals(true);
    setActiveCategory(null);

    try {
      const res = await API.get("/all");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];

      setMeals(list);
      setAllMeals(list);
      setTrending(list.slice(0, 12));

      localStorage.setItem("lastMeals", JSON.stringify(list));
    } catch {
      const cached = localStorage.getItem("lastMeals");
      if (cached) {
        const parsed = JSON.parse(cached);
        setMeals(parsed);
        setAllMeals(parsed);
        setTrending(parsed.slice(0, 12));
      }
    } finally {
      setLoadingMeals(false);
    }
  };

  const loadRandomMeals = async () => {
    const url = activeCategory
      ? `/random?category=${encodeURIComponent(activeCategory)}`
      : "/random";

    setLoadingRandom(true);

    try {
      const res = await API.get(url);
      const list = res.data?.data?.meals || [];
      setRandomMeals(list);
    } finally {
      setLoadingRandom(false);
    }
  };

  // -----------------------------
  // SEARCH
  // -----------------------------
  const handleHeroSearch = async (query) => {
    if (!query) return;

    try {
      const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
      const list = res.data?.data?.meals || [];

      setMeals(list);
      setTrending(list.slice(0, 12));
      window.scrollTo({ top: 260, behavior: "smooth" });
    } catch {}
  };

  // -----------------------------
  // ADD RANDOM
  // -----------------------------
  const handleAddRandom = async () => {
    try {
      const res = await API.get("/random");
      const result = res.data?.data;
      const mealData = result?.meals || result;

      let list = [];

      if (Array.isArray(mealData)) list = mealData;
      else if (mealData) list = [mealData];

      if (list.length) setMeals((prev) => [...list, ...prev]);
    } finally {
      const section = document.getElementById("all-recipes-section");
      section
        ? section.scrollIntoView({ behavior: "smooth" })
        : window.scrollTo({ top: 260, behavior: "smooth" });
    }
  };

  // -----------------------------
  // CATEGORY TOGGLE BEHAVIOR
  // -----------------------------
  const fetchCategoryMealsHandler = async (category) => {
    // 👉 If clicked same chip again → reset to all meals
    if (activeCategory === category) {
      setActiveCategory(null);
      loadAllMeals();
      return;
    }

    // Otherwise load dishes for that category
    setActiveCategory(category);
    setLoadingMeals(true);

    try {
      const res = await getMealsByCategory(category);
      const list = res.data?.data?.meals || [];

      setMeals(list);
      setTrending(list.slice(0, 12));
    } finally {
      setLoadingMeals(false);
      scrollToTop();
    }
  };

  // -----------------------------
  // RANDOM SLIDER ARROWS
  // -----------------------------
  const scrollRandomRow = (direction) => {
    const el = randomScrollRef.current;
    if (!el) return;
    const amount = 260;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // -----------------------------
  // INFINITE SCROLL
  // -----------------------------
  const visibleCount = useInfiniteScroll(meals.length, 12);

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <PageFade>
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HERO */}
        <Hero onSearch={handleHeroSearch} onRandom={handleAddRandom} />

        {/* CATEGORY CHIPS */}
        <div className="mt-6">
          <CategoryChips
            categories={categories}
            activeCategory={activeCategory}
            onClick={fetchCategoryMealsHandler}
          />
        </div>

        {/* RANDOM PICKS */}
        <div className="mt-10">
          <div className="flex items-center justify-between gap-2">
            <SectionHeader
              title="Random Picks For You"
              subtitle="Freshly mixed recipes — discover something new every time"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={loadRandomMeals}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600 text-white text-sm shadow hover:bg-orange-500 transition"
              >
                <span>I'm feeling hungry 🍽️</span>
              </button>

              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => scrollRandomRow("left")}
                  className="w-8 h-8 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                >
                  ‹
                </button>
                <button
                  onClick={() => scrollRandomRow("right")}
                  className="w-8 h-8 rounded-full border border-white/30 bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* RANDOM ROW */}
          <div
            ref={randomScrollRef}
            className="mt-3 -mx-4 px-4 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-4 py-2">
              {loadingRandom ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[calc(50%-0.5rem)] sm:w-[180px] md:w-[200px] lg:w-[240px] xl:w-[260px]"
                  >
                    <div className="rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-800">
                      <div className="h-40 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-3 w-1/2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              ) : randomMeals.length === 0 ? (
                <p className="text-gray-500">No random recipes yet. Try again!</p>
              ) : (
                randomMeals.map((meal) => (
                  <div
                    key={meal.idMeal}
                    className="shrink-0 w-[calc(50%-0.5rem)] sm:w-[180px] md:w-[200px] lg:w-[240px] xl:w-[260px]"
                  >
                    <MealCard meal={meal} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ALL RECIPES */}
        <div id="all-recipes-section" className="mt-12">
          <SectionHeader title="All Recipes" />

          <div className="mt-4">
            {loadingMeals ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <MealGrid meals={meals} visibleCount={visibleCount} />
            )}
          </div>
        </div>
      </div>
    </PageFade>
  );
}
