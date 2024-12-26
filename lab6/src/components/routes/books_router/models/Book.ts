import { Schema, model,Model, Document } from "mongoose";

export interface Book extends Document {
   name: string,
   author: string,
   length: number,
   released: number,
   description: string,
   imageUrl: string,
   rating:{
    numRatings: number,
    points: number,
   }
}

const BookSchema: Schema<Book> = new Schema<Book>({
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

export const BookModel: Model<Book> = model ("Book", BookSchema);