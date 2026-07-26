import { Router } from "express";

import lower from "../services/utils.js";
import validate from "../middleware/validation.js";

import * as schemas from "../services/validator.js";
import ApiError from "../services/apiError.js";

import * as reviewController from "../controllers/reviewController.js";
import * as auth from "../middleware/authentication.js";

const reviewRouter = Router();

reviewRouter.patch(
  "/:id",
  validate(schemas.idParamSchema, "params"),
  auth.authenticate(),
  auth.requireReviewOwner(),
  validate(schemas.reviewPatchSchema, "body"),
  reviewController.updateReviewByID
);

reviewRouter.delete(
  "/:id",
  validate(schemas.idParamSchema, "params"),
  auth.authenticate(),
  auth.requireReviewOwner(),
  reviewController.removeReviewByID
);

export default reviewRouter;
