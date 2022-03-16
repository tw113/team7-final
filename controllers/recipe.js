// Controller for Recipes
const mongoose = require("mongoose");

const validationResult = require("express-validator/check");

const Recipe = require("../models/recipe");

//Returns a list of recipe objects
exports.getRecipes = (req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      res.status.json({
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
exports.postRecipe = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const name = req.body.ingredients.name;
  const quantity = req.body.ingredients.quantity;
  const instructions = req.body.instructions;
  
  const recipe = new Recipe({
    title: title,
    description: description,
    imageUrl: imageUrl,
    userId: req.user.userId,
    ingredients: {
      name: name,
      quantity: quantity
    },
    instructions: instructions
  });
  product
    .save()
    .then(result => {
      console.log('Created Recipe');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
