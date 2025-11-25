// // backend/src/services/mealdb.service.js
// const { request } = require("../utils/apiClient");
// const { cache, saveWithLimit } = require("../config/cache");

// let PRELOADED = false;

// const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// /** ⭐ Smart skip list: low-priority + large categories */
// const SKIP_CATEGORIES = ["Miscellaneous", "Side", "Starter"];

// /** ⭐ Popular categories loaded first */
// const POPULAR_CATEGORIES = [
//   "Chicken",
//   "Beef",
//   "Dessert",
//   "Pasta",
//   "Vegan",
//   "Seafood"
// ];

// /** Base batch settings */
// let BATCH_SIZE = 10;
// const MAX_BATCH = 30;
// const MIN_BATCH = 8;
// let BATCH_DELAY = 350;

// /** Adaptive rate control */
// async function adaptiveWait(startTime) {
//   const elapsed = Date.now() - startTime;

//   if (elapsed < 150) {
//     // Server is fast → increase batch size
//     BATCH_SIZE = Math.min(BATCH_SIZE + 2, MAX_BATCH);
//     BATCH_DELAY = Math.max(BATCH_DELAY - 30, 200);
//   } else if (elapsed > 350) {
//     // Server is slow → decrease batch
//     BATCH_SIZE = Math.max(BATCH_SIZE - 2, MIN_BATCH);
//     BATCH_DELAY = Math.min(BATCH_DELAY + 50, 500);
//   }

//   await wait(BATCH_DELAY);
// }

// /** Cached fetch wrapper */
// async function fetchWithCache(key, endpoint) {
//   const cached = cache.get(key);
//   if (cached) return { fromCache: true, data: cached };

//   const res = await request(endpoint);
//   saveWithLimit(key, res.data);
//   return { fromCache: false, data: res.data };
// }

// module.exports = {
//   searchMeals: (q) => fetchWithCache(`search:${q}`, `search.php?s=${q}`),

//   listCategories: () => fetchWithCache("categories", "categories.php"),

//   mealsByCategory: (c) =>
//     fetchWithCache(`cat:${c}`, `filter.php?c=${encodeURIComponent(c)}`),

//   mealDetails: (id) =>
//     fetchWithCache(`meal:${id}`, `lookup.php?i=${encodeURIComponent(id)}`),

//   /** ⭐ Ultra-fast preload */
//   async preloadAll() {
//     if (PRELOADED) return;
//     PRELOADED = true;

//     console.log("⚡ Starting ultra-fast preload...");

//     const cats = (await this.listCategories()).data.categories || [];

//     // Sort categories:
//     // 1) Popular first
//     // 2) Then others (except skip list)
//     const sorted = [
//       ...POPULAR_CATEGORIES.map((name) => cats.find((c) => c.strCategory === name)),
//       ...cats.filter((c) => !POPULAR_CATEGORIES.includes(c.strCategory)
//                          && !SKIP_CATEGORIES.includes(c.strCategory)),
//     ].filter(Boolean);

//     //  ✓ Preload minimal meals in PARALLEL (popular first)
//     await Promise.all(
//       sorted.map(async (c) => {
//         try {
//           await this.mealsByCategory(c.strCategory);
//         } catch (e) {}
//       })
//     );

//     console.log("✔ Minimal preload done.");

//     // Start full fetch in background
//     this.backgroundFullFetch();
//   },

//   /** ⭐ Ultra-fast full meal detail fetch (adaptive batching) */
//   async backgroundFullFetch() {
//     console.log("⏳ Fetching full meal details (adaptive batching)…");

//     const allMinimal = await this.getAllMeals();
//     const meals = allMinimal.data;

//     for (let i = 0; i < meals.length; i += BATCH_SIZE) {
//       const batch = meals.slice(i, i + BATCH_SIZE);

//       const fetchTime = Date.now();

//       await Promise.all(
//         batch.map(async (m) => {
//           const key = `meal:${m.idMeal}`;
//           if (cache.get(key)) return;

//           try {
//             await this.mealDetails(m.idMeal);
//           } catch {}
//         })
//       );

//       await adaptiveWait(fetchTime);
//     }

//     console.log("🎉 Ultra-fast full caching completed!");
//   },

//   /** Merge minimal + cached full */
//   async getAllMeals() {
//     const { data } = await this.listCategories();
//     const categories = data.categories || [];
//     let out = [];

//     await Promise.all(
//       categories.map(async (c) => {
//         if (SKIP_CATEGORIES.includes(c.strCategory)) return;

//         const minimal = await this.mealsByCategory(c.strCategory);
//         const list = minimal.data.meals || [];

//         for (const m of list) {
//           const full = cache.get(`meal:${m.idMeal}`);
//           out.push(full ? full.meals[0] : m);
//         }
//       })
//     );

//     return { fromCache: true, data: out };
//   },
// };


// backend/src/services/mealdb.service.js
const { request } = require("../utils/apiClient");
const { cache, saveWithLimit } = require("../config/cache");

let PRELOADED = false;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Skip heavy categories */
const SKIP_CATEGORIES = ["Miscellaneous", "Side", "Starter"];

/** Prioritize these categories */
const POPULAR_CATEGORIES = [
  "Chicken",
  "Beef",
  "Dessert",
  "Pasta",
  "Vegan",
  "Seafood"
];

let BATCH_SIZE = 10;
const MAX_BATCH = 30;
const MIN_BATCH = 8;
let BATCH_DELAY = 350;

/** Adaptive wait */
async function adaptiveWait(startTime) {
  const elapsed = Date.now() - startTime;

  if (elapsed < 150) {
    BATCH_SIZE = Math.min(BATCH_SIZE + 2, MAX_BATCH);
    BATCH_DELAY = Math.max(BATCH_DELAY - 30, 200);
  } else if (elapsed > 350) {
    BATCH_SIZE = Math.max(BATCH_SIZE - 2, MIN_BATCH);
    BATCH_DELAY = Math.min(BATCH_DELAY + 50, 500);
  }

  await wait(BATCH_DELAY);
}

/** Cached fetch */
async function fetchWithCache(key, endpoint) {
  const cached = cache.get(key);
  if (cached) return { fromCache: true, data: cached };

  const res = await request(endpoint);
  saveWithLimit(key, res.data);
  return { fromCache: false, data: res.data };
}

module.exports = {
  /** SEARCH */
  searchMeals: (q) => fetchWithCache(`search:${q}`, `search.php?s=${q}`),

  /** CATEGORIES */
  listCategories: () =>
    fetchWithCache("categories", "categories.php"),

  /** MINIMAL CATEGORY */
  mealsByCategory: (c) =>
    fetchWithCache(`cat:${c}`, `filter.php?c=${encodeURIComponent(c)}`),

  /** FULL MEAL DETAILS */
  mealDetails: (id) =>
    fetchWithCache(`meal:${id}`, `lookup.php?i=${encodeURIComponent(id)}`),

  /** ⭐ FIXED RANDOM MEAL */
  async randomMeal() {
    const results = [];

    // Fetch 5 random meals in parallel
    const fetches = [1, 2, 3, 4, 5].map(() =>
      request("random.php").catch(() => null)
    );
  
    const resArr = await Promise.all(fetches);
  
    for (const res of resArr) {
      const meal = res?.data?.meals?.[0];
      if (meal) results.push(meal);
    }
  
    return {
      fromCache: false,
      data: { meals: results }
    };
  },

  /** ⭐ PRELOAD */
  async preloadAll() {
    if (PRELOADED) return;
    PRELOADED = true;

    console.log("⚡ Starting ultra-fast preload...");

    const cats = (await this.listCategories()).data.categories || [];

    const sorted = [
      ...POPULAR_CATEGORIES.map((name) =>
        cats.find((c) => c.strCategory === name)
      ),
      ...cats.filter(
        (c) =>
          !POPULAR_CATEGORIES.includes(c.strCategory) &&
          !SKIP_CATEGORIES.includes(c.strCategory)
      ),
    ].filter(Boolean);

    // Preload minimal lists in parallel
    await Promise.all(
      sorted.map(async (c) => {
        try {
          await this.mealsByCategory(c.strCategory);
        } catch {}
      })
    );

    console.log("✔ Minimal preload complete.");
    this.backgroundFullFetch();
  },

  /** FULL DETAIL BATCHER */
  async backgroundFullFetch() {
    console.log("⏳ Fetching full meal details…");

    const minimal = await this.getAllMeals();
    const meals = minimal.data;

    for (let i = 0; i < meals.length; i += BATCH_SIZE) {
      const batch = meals.slice(i, i + BATCH_SIZE);

      const start = Date.now();

      await Promise.all(
        batch.map(async (m) => {
          const key = `meal:${m.idMeal}`;
          if (cache.get(key)) return;
          try {
            await this.mealDetails(m.idMeal);
          } catch {}
        })
      );

      await adaptiveWait(start);
    }

    console.log("🎉 Full caching completed!");
  },

  /** ⭐ FIXED getAllMeals() */
  async getAllMeals() {
    const { data } = await this.listCategories();
    const categories = data.categories || [];

    let out = [];

    await Promise.all(
      categories.map(async (c) => {
        if (SKIP_CATEGORIES.includes(c.strCategory)) return;

        const minimal = await this.mealsByCategory(c.strCategory);
        const list = minimal.data.meals || [];

        for (const m of list) {
          const fullObj = cache.get(`meal:${m.idMeal}`);

          if (fullObj?.meals?.[0]) {
            out.push(fullObj.meals[0]); // full meal
          } else {
            out.push(m); // minimal meal
          }
        }
      })
    );

    return { fromCache: true, data: out };
  },
};
