// user routes

const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/user/register", userController.postSignup);

router.post("user/login", () => {});

module.exports = router;
