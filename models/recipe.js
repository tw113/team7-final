const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  // ingredients: [
  //   {
  //     name: { type: String, required: true },
  //     quantity: { type: String, required: true },
  //   },
  // ],
  ingredients: {
    type: String,
    required: true,
  } /*MODIFIED: ingredient inputs will have unknown quantity...
  Change to String...maybe come back to list idea later to see if can work*/,
  instructions: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
