import { Router } from "express";
import { errorHandler } from "../middlewares/errorHandler.middleware";
import templateGeneratorRouter from "../router/template-generator.router";

const router = Router();

export default (): Router => {
  templateGeneratorRouter(router);

  /** @note Error handler middleware */
  router.use(errorHandler);
  return router;
};
