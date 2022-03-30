const express = require("express");
const { check, body } = require("express-validator");
const isAuth = require("../middleware/isAuth");

const recipeController = require("../controllers/recipe");

const router = express.Router();

router.get("/recipes", recipeController.getRecipes);

router.get("/recipe/:recipeId", recipeController.getRecipe);

router.post(
  "/recipe",
  [
    check("title").isLength({ min: 5 }),
    check("description").isLength({ min: 5 }),
    check("imageUrl").isLength({ min: 5 }),
    check("ingredients").isLength({ min: 5 }),
    check("instructions").isLength({ min: 5 }),
  ],
  isAuth,
  recipeController.postRecipe
);

router.put(
  "/recipe/:recipeId",
  [
    check("title").isLength({ min: 5 }),
    check("description").isLength({ min: 5 }),
    check("imageUrl").isLength({ min: 5 }),
    check("ingredients").isLength({ min: 5 }),
    check("instructions").isLength({ min: 5 }),
  ],
  isAuth,
  recipeController.putEditRecipe
);

router.delete("/recipe/:recipeId", isAuth, recipeController.deleteRecipe);

module.exports = router;
