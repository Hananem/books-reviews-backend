import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createComment, updateComment, deleteComment } from "../controllers/commentController";

const router = express.Router();

// User - Add a comment to a book (Protected)
router.post("/", authMiddleware, createComment);

// User - Update a comment (Protected)
router.put("/:id", authMiddleware, updateComment);

// User - Delete a comment (Protected)
router.delete("/:id", authMiddleware, deleteComment);


export default router;
