// user routes

const express = require("express");
const { check, body } = require('express-validator/check');

const userController = require("../controllers/user");

const router = express.Router();

router.post(
  "/user/register",
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
      body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
      )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
      body('confirmPassword')
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');
        }
        return true;
      })
  ],
  userController.postSignup
);

router.post("/user/login", userController.postLogin);

module.exports = router;
