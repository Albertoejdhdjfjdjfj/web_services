import { Schema, model} from "mongoose";

const TempCodeSchema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
});

export const TempCodeModel = model ("TempCode", TempCodeSchema);