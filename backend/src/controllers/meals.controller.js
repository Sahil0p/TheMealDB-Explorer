// backend/src/controllers/meals.controller.js
const MealService = require("../services/mealdb.service");

module.exports = {
  async search(req, res) {
    try {
      const q = req.query.q || "";
      const output = await MealService.searchMeals(q);
      res.json({ success: true, cached: output.fromCache, data: output.data });
    } catch (err) {
      console.error("Search Error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to fetch meals" });
    }
  },

  async categories(req, res) {
    try {
      const output = await MealService.listCategories();
      res.json({ success: true, cached: output.fromCache, data: output.data });
    } catch (err) {
      console.error("Categories Error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to fetch categories" });
    }
  },

  async byCategory(req, res) {
    try {
      const category = req.params.category;
      if (!category)
        return res.status(400).json({ success: false, message: "Category parameter is required" });

      const output = await MealService.mealsByCategory(category);
      res.json({ success: true, cached: output.fromCache, data: output.data });
    } catch (err) {
      console.error("Category Meals Error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to fetch meals by category" });
    }
  },

//   async random(req, res) {
//     try {
//       const output = await MealService.randomMeal();
//       res.json({ success: true, cached: output.fromCache, data: output.data });
//     } catch (err) {
//       console.error("Random Meal Error:", err?.message || err);
//       res.status(500).json({ success: false, message: "Failed to fetch random meal" });
//     }
//   },

  async random(req, res) {
    try {
        const category = req.query.category;
    
        if (category) {
          const list = await MealService.mealsByCategory(category);
          const meals = list.data.meals || [];
    
          if (meals.length === 0)
            return res.json({ success: true, cached: false, data: [] });
    
          // pick 3 random meals from category
          const picks = [];
          for (let i = 0; i < 5; i++) {
            picks.push(meals[Math.floor(Math.random() * meals.length)]);
          }
    
          return res.json({ success: true, data: { meals: picks } });
        }
    
        // default: global random
        const output = await MealService.randomMeal();
        return res.json({ success: true, cached: output.fromCache, data: output.data });
      } catch (err) {
        console.error("Random Meal Error:", err?.message || err);
        res.status(500).json({ success: false, message: "Failed to fetch random meal" });
      }
  },
  

  async details(req, res) {
    try {
      const id = req.params.id;
      if (!id)
        return res.status(400).json({ success: false, message: "Meal ID is required" });

      const output = await MealService.mealDetails(id);
      res.json({ success: true, cached: output.fromCache, data: output.data });
    } catch (err) {
      console.error("Meal Details Error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to fetch meal details" });
    }
  },

  /** NEW: GET /all */
  async all(req, res) {
    try {
      const output = await MealService.getAllMeals();
      res.json({ success: true, cached: output.fromCache, data: output.data });
    } catch (err) {
      console.error("All Meals Error:", err?.message || err);
      res.status(500).json({ success: false, message: "Failed to fetch all meals" });
    }
  }
};
