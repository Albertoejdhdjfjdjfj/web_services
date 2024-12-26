import { Schema, model, Model, Document } from "mongoose";

export interface UserBook {
  bookId: string;
  rating: number;
}

export interface UserBookLists extends Document {
  userId: string;
  books: UserBook[];
}

const UserBookListsSchema: Schema<UserBookLists> = new Schema<UserBookLists>({
  userId: { type: String, required: true },
  books: [{ bookId: { type: String }, rating: { type: Number, default: 0 } }],
});

export const UserBookListsModel: Model<UserBookLists> = model<UserBookLists>(
  "UserBookLists",
  UserBookListsSchema
);