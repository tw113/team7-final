// user routes

const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/signup", userController.postSignup); // MODIFIED router.post("/user", userController.postSignUp);

// MODIFIED / DELETED router.post("/user", userController.postUser);

module.exports = router;
