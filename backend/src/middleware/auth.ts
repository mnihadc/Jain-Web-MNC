// src/middleware/auth.ts
import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/generateToken";
import { AuthRequest, IUser } from "../types/auth.types";
import { Student } from "../models/auth/student.model";
import { Teacher } from "../models/auth/teacher.model";
import { Admin } from "../models/auth/admin.model";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Find user based on role
    let user: IUser | null = null;

    switch (decoded.role) {
      case "student":
        const student = (await Student.findById(decoded.userId).select(
          "-password"
        )) as any;
        if (student) {
          user = {
            id: student._id.toString(),
            email: student.contact.email,
            role: "student",
            name: student.fullName,
          };
        }
        break;
      case "teacher":
        const teacher = (await Teacher.findById(decoded.userId).select(
          "-password"
        )) as any;
        if (teacher) {
          user = {
            id: teacher._id.toString(),
            email: teacher.contact.email,
            role: "teacher",
            name: teacher.fullName,
          };
        }
        break;
      case "admin":
        const admin = (await Admin.findById(decoded.userId).select(
          "-password"
        )) as any;
        if (admin) {
          user = {
            id: admin._id.toString(),
            email: admin.contact.email,
            role: "admin",
            name: admin.fullName,
          };
        }
        break;
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid token or user not found",
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
