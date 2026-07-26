import { Router } from "express";

import lower from "../services/utils.js";
import validate from "../middleware/validation.js";

import * as schemas from "../services/validator.js";
import ApiError from "../services/apiError.js";

import * as bookController from "../controllers/bookController.js";
import * as auth from "../middleware/authentication.js";
import { readLimiter, writeLimiter } from "../middleware/rateLimit.js";

const bookRouter = Router();

bookRouter.get(
  "/",
  readLimiter,
  validate(schemas.querySchema, "query"),
  bookController.getBooks,
);

bookRouter.get(
  "/:id",
  readLimiter,
  validate(schemas.idParamSchema, "params"),
  bookController.getBookByID,
);

bookRouter.get(
  "/:id/reviews",
  readLimiter,
  validate(schemas.idParamSchema, "params"),
  bookController.getReviewsByBookID,
);

bookRouter.post(
  "/",
  writeLimiter,
  auth.authenticate(),
  auth.requireAdmin(),
  validate(schemas.bookSchema, "body"),
  bookController.createBook,
);

bookRouter.post(
  "/:id/reviews",
  writeLimiter,
  auth.authenticate(),
  validate(schemas.idParamSchema, "params"),
  validate(schemas.reviewSchema, "body"),
  bookController.addReview,
);

bookRouter.patch(
  "/:id",
  writeLimiter,
  auth.authenticate(),
  auth.requireAdmin(),
  validate(schemas.idParamSchema, "params"),
  validate(schemas.bookPatchSchema, "body"),
  bookController.updateBookByID,
);

bookRouter.delete(
  "/:id",
  writeLimiter,
  auth.authenticate(),
  auth.requireAdmin(),
  validate(schemas.idParamSchema, "params"),
  bookController.removeBookByID,
);

export default bookRouter;
