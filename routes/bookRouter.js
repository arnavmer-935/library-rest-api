import { Router } from "express";

import lower from "../services/utils.js";

import validate from "../middleware/validation.js";

import * as schemas from "../services/validator.js";
import ApiError from "../services/apiError.js";

import * as bookController from "../controllers/bookController.js";

const bookRouter = Router();

bookRouter.get("/", validate(schemas.querySchema, "query"), bookController.getBooks);

bookRouter.get("/:id", validate(schemas.idParamSchema, "params"), bookController.getBookByID);

bookRouter.get("/:id/reviews", validate(schemas.idParamSchema, "params"), bookController.getReviewsByBookID);

bookRouter.post("/", validate(schemas.bookSchema, "body"), bookController.createBook);

bookRouter.post("/:id/reviews", validate(schemas.idParamSchema, "params"), 
            validate(schemas.reviewSchema, "body"), bookController.addReview);

bookRouter.patch("/:id", validate(schemas.idParamSchema, "params"),
                    validate(schemas.bookPatchSchema, "body"), bookController.updateBookByID);

bookRouter.delete("/:id", validate(schemas.idParamSchema, "params"), bookController.removeBookByID);

export default bookRouter;