const { Schema, model } = require("mongoose");

const BookSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  length: { type: Number, required: true },
  released: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rating: {
    numRatings: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
});

module.exports = model ("Book", BookSchema);