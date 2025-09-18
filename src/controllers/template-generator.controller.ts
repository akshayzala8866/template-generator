import { NextFunction, Request, Response } from "express";
import { responseObject } from "../interfaces/template-response.interface";
import { generateTemplate } from "../services/template-generator.service";
import { QuestionPayload } from "../validations/payload.validation";

export const generateCodeTemplate = async (
  req: Request,
  res: Response<responseObject>,
  next: NextFunction
): Promise<void> => {
  try {
    const requestPayload: QuestionPayload = req.body;
    const template = generateTemplate(requestPayload);
    res.status(200).json(template);
  } catch (error) {
    next(error);
  }
};
