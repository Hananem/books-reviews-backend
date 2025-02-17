import mongoose from "mongoose";
import { Request, Response } from "express";
import Book from "../models/Book";
import Comment from "../models/Comments";
import { AuthRequest } from "../middleware/authMiddleware"; // Adjust based on your auth structure

export const createComment = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { bookId, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Create a new comment
    const comment = new Comment({
      book: book._id, // Mongoose handles the conversion
      user: req.user?.userId, // Assuming userId is stored correctly in req.user
      text,
    });

    await comment.save();

    // Add the comment's ID to the book's comments array
    book.comments.push(comment._id); // No need to convert manually
    await book.save();

    return res.status(201).json({ message: "Comment added", comment });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateComment = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params; // Comment ID
      const { text } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
  
      // Find the comment
      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      // Ensure user owns the comment
      if (comment.user.toString() !== req.user?.userId) {
        return res.status(403).json({ message: "Not authorized to update this comment" });
      }
  
      // Update comment text
      comment.text = text;
      await comment.save();
  
      return res.status(200).json({ message: "Comment updated", comment });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Server error" });
    }
  };

  export const deleteComment = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { id } = req.params; // Comment ID
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid comment ID" });
      }
  
      // Find the comment
      const comment = await Comment.findById(id);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      // Ensure user owns the comment
      if (comment.user.toString() !== req.user?.userId) {
        return res.status(403).json({ message: "Not authorized to delete this comment" });
      }
  
      // Remove the comment from the Book's comments array
      await Book.updateOne({ _id: comment.book }, { $pull: { comments: comment._id } });
  
      // Delete the comment
      await comment.deleteOne();
  
      return res.status(200).json({ message: "Comment deleted" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Server error" });
    }
  };
  