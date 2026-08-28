import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { Router } from "express";

import authRouter from "./authRouter.js";
import bookRouter from "./bookRouter.js";
import reviewRouter from "./reviewRouter.js";

const SWAGGER_DOC = YAML.load(path.join(process.cwd(), "docs", "openapi.yaml"));

const gatewayRouter = Router();

gatewayRouter.get("/health", (_req, res) => {

    return res.status(200).send({
        "success": true,
        "code": 200,
        "message": "Server is running"
    });
});

gatewayRouter.get("/", (_req, res) => {

    return res.status(200).send({
        "message": "Don't panic. You're in the right place.",
        "info": {
            "name": "Library REST API",
            "status": "Online",
            "docs": "/api/v1/docs",
            "note": "Hosted on Render's free tier. Initial requests after inactivity may take ~30-60 seconds."
        }
    });
});

gatewayRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(SWAGGER_DOC));

gatewayRouter.use("/auth", authRouter);
gatewayRouter.use("/books", bookRouter);
gatewayRouter.use("/reviews", reviewRouter);

export default gatewayRouter;
