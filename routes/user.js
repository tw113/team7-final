// user routes
const User = require("../models/user");

const express = require("express");
const { check, body } = require("express-validator");

const userController = require("../controllers/user");

const router = express.Router();

router.post(
  "/user/register",
  [
    check("firstName").isLength({ min: 1 }).trim(),
    check("lastName").isLength({ min: 1 }).trim(),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  userController.postSignup
);

router.post(
  "/user/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  userController.postLogin
);

module.exports = router;
