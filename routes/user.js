// user routes

const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/user", userController.postSignUp);

router.post("/user", userController.postUser);

module.exports = router;