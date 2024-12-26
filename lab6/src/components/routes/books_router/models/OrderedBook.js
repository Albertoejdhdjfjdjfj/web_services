const { Schema, model}= require("mongoose");



const  OrderedBookSchema = new Schema({
  bookId: { type: String, required: true },
  usersIds: { type: [String], required: true },
});

module.exports =  model ("OrderedBook",OrderedBookSchema);