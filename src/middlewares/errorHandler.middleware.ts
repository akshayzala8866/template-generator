import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error.util";

export const errorHandler: ErrorRequestHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error instanceof ApiError ? error.statusCode : 500;
  const message = error.message || "Internal Server Error";

  res.status(status).json({
    success: false,
    message,
  });
};
