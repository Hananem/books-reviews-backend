import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Book from "../models/Book";
import cloudinary from "../config/cloudinaryConfig"; // Import Cloudinary config
// Get Profile by ID with Book Reviews
export const getProfileById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password")
      .populate({
        path: "books", // Assuming user has a books field
        populate: {
          path: "reviews.user",
          select: "username email", // Fetch reviewer details
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { username, email, password, bio, profilePhoto, socialLinks } = req.body;
    
    let updatedData: any = { username, email, bio, profilePhoto, socialLinks };

    // Hash new password if provided
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Remove Bio from Profile
export const removeBio = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    const updatedUser = await User.findByIdAndUpdate(id, { $unset: { bio: "" } }, { new: true }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// Upload Profile Photo (Separate Endpoint)
export const uploadProfilePhoto = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path);

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { profilePhoto: uploadResult.secure_url },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};

// Delete Profile and Remove User's Reviews
export const deleteProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    // Remove user's reviews from books
    await Book.updateMany({}, { $pull: { reviews: { user: id } } });
    
    // Delete user profile
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User and associated reviews deleted successfully" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};
