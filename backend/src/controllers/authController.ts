// src/controllers/authController.ts
import { Request, Response } from "express";
import { Student } from "../models/auth/student.model";
import { Teacher } from "../models/auth/teacher.model";
import { Admin } from "../models/auth/admin.model";
import { generateToken } from "../utils/generateToken";
import {
  LoginCredentials,
  AuthResponse,
  IUser,
  UserRole,
} from "../types/auth.types";

export class AuthController {
  /**
   * Handle user login across all roles
   */
  public static login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, role }: LoginCredentials = req.body;

      // Validate required fields
      if (!email || !password || !role) {
        res.status(400).json({
          success: false,
          message: "Email, password, and role are required",
        });
        return;
      }

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
        return;
      }

      // Find user based on role
      const user = await AuthController.findUserByRole(email, role);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials or user not found",
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: "Account is deactivated. Please contact administrator.",
        });
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      // Prepare user data for token and response
      const userData = AuthController.prepareUserData(user, role);

      // Generate JWT token
      const token = generateToken({
        userId: userData.id,
        email: userData.email,
        role: userData.role,
      });

      // Update last login
      await AuthController.updateLastLogin(user, role);

      // Set HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Send success response
      const response: AuthResponse = {
        success: true,
        message: "Login successful",
        user: userData,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  };

  /**
   * Get current authenticated user
   */
  public static getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      // User is attached to request by auth middleware
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  /**
   * Handle user logout
   */
  public static logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Clear the token cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  /**
   * Find user by role and email
   */
  private static async findUserByRole(email: string, role: UserRole) {
    switch (role) {
      case "student":
        return await Student.findOne({ "contact.email": email });
      case "teacher":
        return await Teacher.findOne({ "contact.email": email });
      case "admin":
        return await Admin.findOne({ "contact.email": email });
      default:
        return null;
    }
  }

  /**
   * Prepare user data for response (exclude password)
   */
  private static prepareUserData(user: any, role: UserRole): IUser {
    let userData: IUser;

    switch (role) {
      case "student":
        userData = {
          id: user._id.toString(),
          email: user.contact.email,
          role: "student",
          name: user.fullName,
        };
        break;
      case "teacher":
        userData = {
          id: user._id.toString(),
          email: user.contact.email,
          role: "teacher",
          name: user.fullName,
        };
        break;
      case "admin":
        userData = {
          id: user._id.toString(),
          email: user.contact.email,
          role: "admin",
          name: user.fullName,
        };
        break;
      default:
        throw new Error("Invalid user role");
    }

    return userData;
  }

  /**
   * Update last login timestamp
   */
  private static async updateLastLogin(
    user: any,
    role: UserRole
  ): Promise<void> {
    const updateData = { lastLogin: new Date() };

    try {
      switch (role) {
        case "student":
          await Student.findByIdAndUpdate(user._id, updateData);
          break;
        case "teacher":
          await Teacher.findByIdAndUpdate(user._id, updateData);
          break;
        case "admin":
          await Admin.findByIdAndUpdate(user._id, updateData);
          break;
      }
    } catch (error) {
      console.error("Error updating last login:", error);
      // Don't throw error, as login should still succeed
    }
  }
}
