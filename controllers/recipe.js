// Controller for Recipes
const mongoose = require("mongoose");

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

//Creates recipe if user is logged in
exports.postRecipe = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const ingredients = req.body.ingredients;
  const instructions = req.body.instructions;

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

exports.putEditRecipe = (req, res, next) => {
  //TODO: get the recipe id using req.params.recipeId and save it in a const

  const title = req.body.title;
  let imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const ingredients = req.body.ingredients;
  const instructions = req.body.instructions;

  //TODO: Find recipe by id in Recipe database

  //TODO: Provide error message if a recipe by that id cannot be found

  //TODO: Replace old values for the recipe title, imageUrl, description, ingredients, & instructions with new values

  //TODO: Save the updated recipe

  Recipe.findOne({ title: title })
    .then((recipe) => {
      if (recipe) {
        bcrypt.compare(title, recipe.title).then((result) => {
          if (result) {
            res
              .status(200)
              .json({ message: "Recipe Successfully Added", recipe: recipe });
          } else {
            res.status(400).json({ message: "Recipe could not be added" });
          }
        });
      } else {
        res.status(401).json({ message: "Recipe not found" });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

//Deletes a recipe
exports.deleteRecipe = (req, res, next) => {
  const recipeId = req.params.recipeId;
  Recipe.findByIdAndRemove(recipeId)
    .then(() => {
      console.log("DESTROYED RECIPE");
      // res.redirect("/recipes");
      res.status(200).json({ message: "Recipe Deleted" });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
