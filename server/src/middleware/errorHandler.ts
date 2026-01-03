import { Request, Response, NextFunction } from "express";
import { ApiError, handleError } from "../utils/errors";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, body } = handleError(err);
  res.status(statusCode).json(body);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
