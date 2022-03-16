const express = require("express");

const recipeController = require("../controllers/recipe");

const router = express.Router();

router.get("/recipes", recipeController.getRecipes);

router.get("/recipes/:recipeId", recipeController.getRecipe);

router.post("/recipes", recipeController.postRecipe);

module.exports = router;
