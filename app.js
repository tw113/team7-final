const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const PORT = process.env.PORT || 8080;
const MONGODB_URL =
  process.env.MONGODB_URL ||
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cookbookcluster.cikzo.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
  origin: "https://<your_app_name>.herokuapp.com/",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const options = {
  family: 4,
};

const recipeRoutes = require("./routes/recipe");
const userRoutes = require("./routes/user");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", (res, req, next) => {
  req.json({ test: "test" });
});

app.use(userRoutes);
app.use(recipeRoutes);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
});

mongoose
  .connect(MONGODB_URL, options)
  .then((result) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.listen(PORT);
  })

  .catch((err) => console.log(err));
