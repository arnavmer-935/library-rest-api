import { Router } from "express";
import bcrypt from "bcrypt";

import validate from "../middleware/validation.js";
import * as schemas from "../services/validator.js";
import ApiError from "../services/apiError.js";
import Users from "../models/User.js";

import * as authController from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register", validate(schemas.authBodySchema, "body"), authController.registerUser);

authRouter.post("/login", validate(schemas.loginSchema), "body", authController.loginUser);

export default authRouter;