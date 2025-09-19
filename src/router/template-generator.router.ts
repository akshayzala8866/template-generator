import express from "express";
import { generateCodeTemplate } from "../controllers/template-generator.controller";
import { validatePayload } from "../middlewares/validate-payload.middleware";
import { questionSchema } from "../validations/payload.validation";

export default (router: express.Router) => {
  router.post(
    "/template",
    validatePayload(questionSchema),
    generateCodeTemplate
  );
};
