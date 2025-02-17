import { Request, Response } from "express";
import Book from "../models/Book";
import { AuthRequest } from "../middleware/authMiddleware";

export const createBook = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, author, description, publishedYear, genre } = req.body;
    const book = new Book({ title, author, description, publishedYear, genre, createdBy: req.user?.userId });
    await book.save();
    return res.status(201).json(book);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const books = await Book.find().populate("createdBy", "username");
    return res.status(200).json(books);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<any> => {
  try {
    const book = await Book.findById(req.params.id).populate("createdBy", "username");
    if (!book) return res.status(404).json({ message: "Book not found" });
    return res.status(200).json(book);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const updateBook = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(book, req.body);
    await book.save();
    return res.status(200).json(book);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.createdBy.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await book.deleteOne();
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
