const express = require("express");

const recipeController = require("../controllers/recipe");

const router = express.Router();

router.get("/recipes", recipeController.getRecipes);

router.get("/recipes/:recipeId", recipeController.getRecipe);

//My preference= "recipe" over "recipes" since it is only posting 1 recipe
router.post("/recipe", recipeController.postRecipe); // MODIFIED router.post("/recipes", recipeController.postRecipe);

module.exports = router;
