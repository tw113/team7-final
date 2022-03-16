const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const recipeRoutes = require("./routes/recipe");
const userRoutes = require("./routes/user"); // MODIFIED / ADDED

app.use(bodyParser.json()); // application/json content

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (res, req, next) => {
  req.json({ test: "test" });
});

app.use(userRoutes); // MODIFIED / ADDED
app.use(recipeRoutes);

mongoose
  .connect(
    "mongodb+srv://Cookbook:TEAM7CSE341@cookbookcluster.cikzo.mongodb.net/CookBookCluster?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
  })

  .catch((err) => console.log(err));

//app.listen(8080);
