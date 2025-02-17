import mongoose, { Schema, Document } from "mongoose";

// Define TypeScript Interface for User
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: boolean; // Added Admin field
}

// Define Mongoose Schema
const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Default: Not an admin
});

// Export the Model
export default mongoose.model<IUser>("User", UserSchema);

