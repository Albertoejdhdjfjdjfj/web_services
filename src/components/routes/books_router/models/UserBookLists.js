const { Schema, model } = require("mongoose");

const UserBookListsSchema = new Schema({
  userId: { type: String, required: true },
  books: [{ bookId: { type: String }, rating: { type: Number, default: 0 } }],
});

module.exports =  model( "UserBookLists",UserBookListsSchema);