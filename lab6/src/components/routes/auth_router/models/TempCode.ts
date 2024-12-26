import { Schema, model,Model, Document } from "mongoose";

export interface TempCode extends Document {
   email: String,
   code: String
}

const TempCodeSchema: Schema<TempCode> = new Schema<TempCode>({
  email: { type: String, required: true },
  code: { type: String, required: true },
});

export const TempCodeModel: Model<TempCode> = model ("TempCode", TempCodeSchema);