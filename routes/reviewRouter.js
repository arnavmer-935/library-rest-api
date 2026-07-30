import { Router } from "express";

import lower from "../services/utils.js";
import validate from "../middleware/validation.js";

import * as schemas from "../services/validator.js";
import ApiError from "../services/apiError.js";

import * as reviewController from "../controllers/reviewController.js";
import { authenticate, requireAdmin, requireReviewOwner, requireReviewOwnerOrAdmin } from "../middleware/authentication.js";
import { writeLimiter } from "../middleware/rateLimit.js";

const reviewRouter = Router();

reviewRouter.use(writeLimiter);

reviewRouter.patch(
  "/:id",
  validate(schemas.idParamSchema, "params"),
  authenticate,
  requireReviewOwner,
  validate(schemas.reviewPatchSchema, "body"),
  reviewController.updateReviewByID
);

reviewRouter.delete(
  "/:id",
  validate(schemas.idParamSchema, "params"),
  authenticate,
  requireReviewOwnerOrAdmin,
  reviewController.deleteReviewByID
);

export default reviewRouter;
