import sequelize from "../config/database.js";
import { Op } from "Sequelize";

import { getDataFromQuery } from "../services/utils";
import { Users, Books, Reviews } from "../models/associations.js";
import { isDefined } from "../services/utils";

export const updateReviewByID = async (req, res) => {

    const reviewId = req.params.id;

    const { rating, comment } = req.body;

    try {

        const requiredReview = await Reviews.findByPk(reviewId);

        if (!requiredReview) {
            throw ApiError.notFound(`Review with ID ${id} not found`);
        }

        if (isDefined(rating)) {
            requiredReview.rating = rating;
        }
        
        if (isDefined(comment)) {
            requiredReview.comment = comment;
        }

        await requiredReview.save();

        return res.status(200).send({
            "success": true,
            "message": `Updated book with ID ${id}`,
            "updated-review": requiredReview.dataValues
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