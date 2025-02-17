import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { userId: string; isAdmin: boolean };
  }

  export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
      }
  
      // Extract token after "Bearer "
      const token = authHeader.split(" ")[1];
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; isAdmin: boolean };
      req.user = { userId: decoded.userId, isAdmin: decoded.isAdmin };
  
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
  

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ message: "Access denied, admin only" });
    return; // Ensure function stops execution
  }
  next();
};
