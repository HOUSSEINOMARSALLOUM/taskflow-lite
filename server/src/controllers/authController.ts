import { Request, Response } from "express";
import authService from "../services/authService";
import {
  generateAccessToken,
  generateRefreshToken,
  AuthRequest,
} from "../utils/jwt";
import { asyncHandler } from "../middleware/errorHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ error: "Email, name, and password are required" });
    return;
  }

  const user = await authService.register({ email, name, password });
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.status(201).json({
    user,
    accessToken,
    refreshToken,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await authService.login({ email, password });
  const accessToken = generateAccessToken(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  res.json({
    user,
    accessToken,
    refreshToken,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token is required" });
    return;
  }

  const { verifyRefreshToken } = await import("../utils/jwt");
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    res.status(401).json({ error: "Invalid refresh token" });
    return;
  }

  const user = await authService.getUserById(decoded.id as string);
  const accessToken = generateAccessToken(user.id, user.email, user.role);

  res.json({ accessToken });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.getUserById(req.user!.id);
  res.json({ user });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  // In a real app, you'd invalidate the token server-side (add to blacklist, etc.)
  res.json({ message: "Logged out successfully" });
});
