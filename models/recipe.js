const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.type.userId,
    ref: 'User',
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
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true },
    },
  ],
  instructions: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);