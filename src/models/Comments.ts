import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    book: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
const CommentSchema = new Schema<IComment>(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IComment>("Comment", CommentSchema);
