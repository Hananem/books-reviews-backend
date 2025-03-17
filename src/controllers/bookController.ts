import { Request, Response } from "express";
import Book from "../models/Book";
import { AuthRequest } from "../middleware/authMiddleware";

import cloudinary from "../config/cloudinaryConfig";// Cloudinary config


import stream from "stream";

export const createBook = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, author, description, publishedYear, genre } = req.body;

    let imageUrl: string = "";

    if (req.file && req.file.buffer) {
      const uploadedImage = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new Error("Cloudinary upload failed"));
            } else {
              resolve(result?.secure_url || "");
            }
          }
        );
      
        // Ensure the stream is properly handled
        import("stream").then(({ PassThrough }) => {
          const bufferStream = new PassThrough();
          bufferStream.end(req.file!.buffer);
          bufferStream.pipe(uploadStream);
        });
      });
      
      console.log("Uploaded Image URL:", uploadedImage);

      imageUrl = uploadedImage;
    }

    const book = new Book({
      title,
      author,
      description,
      publishedYear,
      genre,
      createdBy: req.user?.userId,
      imageUrl, // Store image URL
    });

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
    const { bookId } = req.params;
    const { title, author, description, publishedYear, genre } = req.body;

    let imageUrl: string = "";

    // Find the book by its ID
    const existingBook = await Book.findById(bookId);
    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user is the creator of the book (optional, depending on your authorization logic)
    if (existingBook.createdBy.toString() !== req.user?.userId) {
      return res.status(403).json({ message: "You are not authorized to update this book" });
    }

    // Check if there's a new image file in the request and upload it
    if (req.file && req.file.buffer) {
      const uploadedImage = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(new Error("Cloudinary upload failed"));
            } else {
              resolve(result?.secure_url || "");
            }
          }
        );

        // Convert buffer to a readable stream and pipe it to Cloudinary
        import("stream").then(({ PassThrough }) => {
          const bufferStream = new PassThrough();
          bufferStream.end(req.file!.buffer);
          bufferStream.pipe(uploadStream);
        });
      });

      console.log("Uploaded Image URL:", uploadedImage);
      imageUrl = uploadedImage;
    }

    // Update the book with the new data
    existingBook.title = title || existingBook.title;
    existingBook.author = author || existingBook.author;
    existingBook.description = description || existingBook.description;
    existingBook.publishedYear = publishedYear || existingBook.publishedYear;
    existingBook.genre = genre || existingBook.genre;
    if (imageUrl) {
      existingBook.imageUrl = imageUrl; // Update imageUrl if a new one is uploaded
    }

    // Save the updated book
    await existingBook.save();

    return res.status(200).json(existingBook);
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

export const searchBooks = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, author, publishedYear, genre } = req.query;

    let query: any = {};
    if (title) query.title = { $regex: new RegExp(title as string, "i") };
    if (author) query.author = { $regex: new RegExp(author as string, "i") };
    if (publishedYear) query.publishedYear = Number(publishedYear);
    if (genre) query.genre = { $regex: new RegExp(genre as string, "i") };

    const books = await Book.find(query).populate("createdBy", "username");
    return res.status(200).json(books);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

