const router = require("express").Router();
const controller = require("../controllers/meals.controller");

// GET /api/meals/search?q=chicken
router.get("/search", controller.search);

// GET /api/meals/categories
router.get("/categories", controller.categories);

// GET /api/meals/category/:category
router.get("/category/:category", controller.byCategory);

// GET /api/meals/random
router.get("/random", controller.random);

// GET /api/meals/details/:id
router.get("/details/:id", controller.details);

// GET /api/meals/all
router.get("/all", controller.all);

module.exports = router;
