import { Schema, model,Model, Document } from "mongoose";

export interface User extends Document {
  username: string;
  birthday: string;
  email: string;
  password: string;
}

const UserSchema: Schema<User> = new Schema<User>({
  username: { type: String, required: true },
  birthday: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export const UserModel: Model<User> = model ("User", UserSchema);