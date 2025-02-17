import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  publishedYear: number;
  genre: string;
  reviews: {
    user: Types.ObjectId; // Use Types.ObjectId for TypeScript compatibility
    rating: number;
  }[];
  comments: Types.ObjectId[];
  createdBy: Types.ObjectId;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    publishedYear: { type: Number, required: true },
    genre: { type: String, required: true },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Corrected
        rating: { type: Number, required: true, min: 1, max: 5 },
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }], // Corrected
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Corrected
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", BookSchema);

