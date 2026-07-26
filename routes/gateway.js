import authRouter from "./authRouter.js";
import bookRouter from "./bookRouter.js";
import reviewRouter from "./reviewRouter.js";

import { Router } from "express";

const gatewayRouter = Router();

gatewayRouter.use("/auth", authRouter);
gatewayRouter.use("/books", bookRouter);
gatewayRouter.use("/reviews", reviewRouter);

export default gatewayRouter;