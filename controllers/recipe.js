// Controller for Recipes
const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

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

//Creates recipe if user is logged in
exports.postRecipe = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const ingredients = req.body.ingredients;
  const instructions = req.body.instructions;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      errorMessage: errors.array()[0].errorMessage,
      validationErrors: errors.array(),
    });
  }

  //Get user so added recipeId can also be added to logged in user recipe list
  const user = await User.findById(req.userId);
  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  const recipe = new Recipe({
    title: title,
    description: description,
    imageUrl: imageUrl,
    userId: req.userId,
    ingredients: ingredients,
    instructions: instructions,
  });

  recipe
    .save()
    .then((result) => {
      console.log("Created Recipe");
      res.status(201).json({
        message: "Recipe Added Successfully",
        recipeId: result._id,
        newRecipe: result,
      });
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

exports.putEditRecipe = (req, res, next) => {
  const recipeId = req.params.recipeId;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedImageUrl = req.body.imageUrl;
  const updatedIngredients = req.body.ingredients;
  const updatedInstructions = req.body.instructions;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      errorMessage: errors.array()[0].errorMessage,
      validationErrors: errors.array(),
    });
  }
  Recipe.findById(recipeId)
    .then((recipe) => {
      if (!recipe) {
        const error = new Error("Could not find recipe");
        error.statusCode = 404;
        throw error;
      }
      if (recipe.userId.toString() !== req.userId) {
        return res.status(403).json({
          message: "Not Authorized to edit this recipe",
        });
      }
      recipe.title = updatedTitle;
      recipe.description = updatedDescription;
      recipe.imageUrl = updatedImageUrl;
      recipe.ingredients = updatedIngredients;
      recipe.instructions = updatedInstructions;
      return recipe.save();
    })
    .then((updatedRecipe) => {
      console.log("Updated Recipe");
      res.status(200).json({
        message: "Recipe Updated Successfully",
        recipeId: updatedRecipe._id,
        updatedRecipe: updatedRecipe,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//Deletes a recipe as well as the recipe in the logged-in users list.
exports.deleteRecipe = (req, res, next) => {
  const recipeId = req.params.recipeId;
  const userId = req.userId;
  Recipe.findById(recipeId)
    .then((recipe) => {
      if (recipe.userId.toString() !== req.userId) {
        return res.status(403).json({
          message: "Not Authorized to delete this recipe",
        });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

  User.findById(userId)
    .then((user) => {
      const updatedUserRecipes = user.recipes.filter((recipe) => {
        return recipe.recipeId.toString() !== recipeId.toString();
      });
      user.recipes = updatedUserRecipes;
      console.log("RECIPE REMOVED FROM LIST");
      return user.save();
    })
    .then((result) => {
      return Recipe.findByIdAndRemove(recipeId);
    })
    .then((result) => {
      console.log("DESTROYED RECIPE");
      res.status(200).json({ message: "Recipe Deleted" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
