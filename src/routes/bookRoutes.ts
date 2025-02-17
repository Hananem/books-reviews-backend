import express, { Request, Response, NextFunction } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { createBook, getBooks, getBookById, updateBook, deleteBook } from "../controllers/bookController";

const router = express.Router();

// Public - Get all books
router.get("/", getBooks);

// Public - Get a single book by ID
router.get("/:id", getBookById);

// User - Create a book review (Protected)
router.post("/", authMiddleware, createBook);

// User - Update a book review (Protected)
router.put("/:id", authMiddleware, updateBook);

// Admin - Delete a book review (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook);

export default router;

