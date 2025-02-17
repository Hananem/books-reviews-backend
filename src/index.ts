import express, { Request, Response } from 'express';
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import bookRoutes from "./routes/bookRoutes";
import commentRoutes from "./routes/commentsRoutes";
import profileRoutes from "./routes/profileRoutes";
import dotenv from "dotenv";
// Create an Express app
const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
console.log("JWT_SECRET:", process.env.JWT_SECRET);
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());


// Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/comments", commentRoutes);
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});