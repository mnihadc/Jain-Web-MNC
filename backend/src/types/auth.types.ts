// src/types/auth.types.ts
import { Request } from "express";
import { IStudent } from "../models/auth/student.model";
import { ITeacher } from "../models/auth/teacher.model";
import { IAdmin } from "../models/auth/admin.model";

export type UserRole = "student" | "teacher" | "admin";

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: IUser;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
