import { Schema, model,Model, Document } from "mongoose";



const  OrderedBookSchema = new Schema({
  bookId: { type: String, required: true },
  usersIds: { type: [String], required: true },
});

export const  OrderedBookModel = model ("OrderedBook",OrderedBookSchema);