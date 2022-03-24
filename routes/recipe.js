const express = require("express");
const isAuth = require("../middleware/isAuth");

const recipeController = require("../controllers/recipe");

const router = express.Router();

router.get("/recipes", recipeController.getRecipes);

router.get("/recipes/:recipeId", recipeController.getRecipe);

router.post("/recipe", /*isAuth,*/ recipeController.postRecipe); // MODIFIED router.post("/recipes", recipeController.postRecipe);

router.put("/:id", async(req, res) =>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    // const { name, quantity} = req.body.ingredients;
    const ingredients = req.body.ingredients; //MODIFIED: Ingredients is now a String instead of list of objects
    const instructions = req.body.instructions;
  
    const recipe = new Recipe({
      title: title,
      description: description,
      imageUrl: imageUrl,
      userId: mongoose.Types.ObjectId("62316881efcc971eb862e952"), //MODIFIED : temporarily hardcoded
      // ingredients: {
      //   name: name,
      //   quantity: quantity,
      // },
      ingredients: ingredients, //MODIFIED: Ingredients is now a String instead of list of objects
      instructions: instructions,
  });
  });

module.exports = router;
