// src/utils/generateToken.ts
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "24h",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.verify(token, secret) as JwtPayload;
};
