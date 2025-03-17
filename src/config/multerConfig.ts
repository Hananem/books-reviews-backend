import multer from "multer";

const storage = multer.memoryStorage(); // Keep file in memory for direct Cloudinary upload

export const upload = multer({ storage });

