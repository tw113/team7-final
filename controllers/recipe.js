// Controller for Recipes
const { Router } = require("express");
const mongoose = require("mongoose");
//module.exports = router;

// const validationResult = require("express-validator/check"); // MODIFIED - commented out -> not using yet

const Recipe = require("../models/recipe");
const User = require("../models/user");

//Returns a list of recipe objects
exports.getRecipes = (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      res.status(200).json({
        message: "Fetched Recipes",
        recipes: recipes,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//Returns a single recipe object
exports.getRecipe = (req, res, next) => {
  const recipeId = req.params.recipeId;
  Recipe.findById(recipeId)
    .then((recipe) => {
      if (!recipe) {
        const error = new Error("Could not find recipe");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Recipe fetched",
        recipe: recipe,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//Creates recipe
exports.postRecipe = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  // const { name, quantity} = req.body.ingredients;
  const ingredients = req.body.ingredients; //MODIFIED: Ingredients is now a String instead of list of objects
  const instructions = req.body.instructions;

  const userId = /* req.userId*/ mongoose.Types.ObjectId(
    "62316881efcc971eb862e952"
  );

  //Get user so added recipeId can also be added to logged in user recipe list
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode(404);
    throw error;
  }

  const recipe = new Recipe({
    title: title,
    description: description,
    imageUrl: imageUrl,
    userId: userId, //MODIFIED : temporarily hardcoded
    ingredients: ingredients, //MODIFIED: Ingredients is now a String instead of list of objects

    instructions: instructions,
  });

  recipe
    .save()
    .then((result) => {
      console.log("Created Recipe");
      res.status(201).json({ message: "Recipe Added Successfully" });
      user.recipes.push({ recipeId: result._id });
      return user.save();
    })
    .then((result) => {
      console.log("Added recipe to User recipe list");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  //Add user to recipe list
};


//Deletes a recipe
exports.deleteRecipe = (req, res, next) => {
  const recipeId = req.params.recipeId;
  Recipe.deleteOne(recipeId)
    .then(() => {
        console.log('DESTROYED RECIPE');
        res.redirect('/recipes');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
