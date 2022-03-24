const express = require("express");
const isAuth = require("../middleware/isAuth");

const recipeController = require("../controllers/recipe");

const router = express.Router();

router.get("/recipes", recipeController.getRecipes);

router.get("/recipe/:recipeId", recipeController.getRecipe);

router.post("/recipe", /*isAuth,*/ recipeController.postRecipe); // MODIFIED router.post("/recipes", recipeController.postRecipe);

router.put("/recipe/:recipeId", recipeController.putEditRecipe);

module.exports = router;
