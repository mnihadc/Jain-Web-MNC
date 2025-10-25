// src/routes/authRoutes.ts
import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post("/login", AuthController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", authMiddleware, AuthController.getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
