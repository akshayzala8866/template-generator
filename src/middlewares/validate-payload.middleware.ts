import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import { ApiError } from "../utils/api-error.util";

export const validatePayload =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const details = error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
        next(new ApiError(400, `Validation failed => ${details.join(", ")}`));
      } else {
        next(error);
      }
    }
  };
