import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const generateAccessToken = (
  userId: string,
  email: string,
  role: string
): string => {
  const secret = process.env.JWT_SECRET || "secret";
  return jwt.sign({ id: userId, email, role }, secret, {
    expiresIn: process.env.JWT_EXPIRE_IN || "24h",
  } as any);
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET || "refresh-secret";
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_IN || "7d",
  } as any);
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "refresh-secret"
    ) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  req.user = {
    id: decoded.id as string,
    email: decoded.email as string,
    role: decoded.role as string,
  };

  next();
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    next();
  };
};
