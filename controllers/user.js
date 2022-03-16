// Controller for Users
const mongoose = require("mongoose");

const validationResult = require("express-validator/check");

const User = require("../models/user");
  
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Successfully signed up");
    }
  
    bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
        return user.save();
      })
      .then(result => {
        res.redirect('/login');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };