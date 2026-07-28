import sequelize from "../config/database.js";
import { Op } from "Sequelize";

import { getDataFromQuery } from "../services/utils.js";
import { Users, Books, Reviews } from "../models/associations.js";
import { isDefined } from "../services/utils.js";

export const updateReviewByID = async (req, res, next) => {

    const reviewId = req.validated.params.id;

    const { rating, comment } = req.body;

    try {

        if (isDefined(rating)) {
            req.review.rating = rating;
        }
        
        if (isDefined(comment)) {
            req.review.comment = comment;
        }

        await req.review.save();

        return res.status(200).send({
            "success": true,
            "message": `Updated review with ID ${reviewId}`,
            "updated-review": req.review
        });

    }

    catch (err) {
        next(err);
    }
};

export const deleteReviewByID = async (req, res, next) => {

    const review = req.review;

    const id = review.review_id;

    try {
        
        await review.destroy();

        return res.status(200).send({
            "success": true,
            "message": `Deleted review with ID ${id}`
        });

    }

    catch (err) {
        next(err);
    }
}