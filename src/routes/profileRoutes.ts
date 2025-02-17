import express from "express";
import { getProfileById, updateProfile, deleteProfile, removeBio } from "../controllers/profileController";

const router = express.Router();

// Get user profile by ID (with book reviews)
router.get("/:id", getProfileById);

// Update user profile
router.put("/:id", updateProfile);

// Remove bio from profile
router.patch("/profile/:id/remove-bio", removeBio);

// Delete user profile and remove associated reviews
router.delete("/:id", deleteProfile);

export default router;
