import { Schema, model } from "mongoose";

const UserBookListsSchema = new Schema<UserBookLists>({
  userId: { type: String, required: true },
  books: [{ bookId: { type: String }, rating: { type: Number, default: 0 } }],
});

export const UserBookListsModel = model(
  "UserBookLists",
  UserBookListsSchema
);