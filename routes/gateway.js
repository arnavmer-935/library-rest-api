import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { Router } from "express";

import authRouter from "./authRouter.js";
import bookRouter from "./bookRouter.js";
import reviewRouter from "./reviewRouter.js";

const SWAGGER_DOC = YAML.load(path.join(process.cwd(), "docs", "openapi.yaml"));

const gatewayRouter = Router();

gatewayRouter.use("/auth", authRouter);
gatewayRouter.use("/books", bookRouter);
gatewayRouter.use("/reviews", reviewRouter);
gatewayRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(SWAGGER_DOC));
gatewayRouter.use("/health", (_req, res) => res.status(200).send({ "success": true, "code": 200, "message": "Server is running" }));

export default gatewayRouter;