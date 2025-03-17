import express, { Request, Response, NextFunction } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { createBook, getBooks, getBookById, updateBook, deleteBook, searchBooks } from "../controllers/bookController";
import { upload } from "../config/multerConfig";
const router = express.Router();

// Public - Get all books
router.get("/books", getBooks);

// Public - Get a single book by ID
router.get("/:id", getBookById);

// User - Create a book review (Protected)
router.post("/create", authMiddleware, upload.single("image"), createBook);

// User - Update a book (Protected)
router.put("/:bookId", authMiddleware, upload.single("image"), updateBook);

// Admin - Delete a book review (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook);

router.get("/", searchBooks);

export default router;

