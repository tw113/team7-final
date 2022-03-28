const express = require("express");
const isAuth = require("../middleware/isAuth");

const recipeController = require("../controllers/recipe");

const router = express.Router();

router.get("/recipes", recipeController.getRecipes);

router.get("/recipe/:recipeId", recipeController.getRecipe);

router.post("/recipe", /*isAuth,*/ recipeController.postRecipe);

router.put("/recipe/:recipeId", /* isAuth,*/ recipeController.putEditRecipe);

router.delete("/recipe/:recipeId", /* isAuth,*/ recipeController.deleteRecipe);

module.exports = router;
