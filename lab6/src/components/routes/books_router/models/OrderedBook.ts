import { Schema, model,Model, Document } from "mongoose";

export interface OrderedBook extends Document {
   bookId: string,
   usersIds:string[]
}

const  OrderedBookSchema: Schema<OrderedBook> = new Schema<OrderedBook>({
  bookId: { type: String, required: true },
  usersIds: { type: [String], required: true },
});

export const  OrderedBookModel: Model< OrderedBook> = model ("OrderedBook",OrderedBookSchema);