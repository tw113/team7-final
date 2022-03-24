// Controller for Users
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //MODIFIED / ADDED -> make sure to npm install --save bcrypt

// const validationResult = require("express-validator"); // MODIFIED - commented out -> not using yet

const User = require("../models/user");

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName; // MODIFIED / ADDED
  const lastName = req.body.lastName; // MODIFIED / ADDED
  const email = req.body.email;
  const password = req.body.password;

  //MODIFIED: temporarily commented out -> not yet using in route
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   console.log("Successfully signed up");
  // }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        firstName: firstName, // MODIFIED / ADDED
        lastName: lastName, // MODIFIED / ADDED
        email: email,
        password: hashedPassword,
        recipes: [], // MODIFIED cart: { items: [] }, to recipes: []
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User Added Successfully." }); // MODIFIED / ADDED
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

