import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../services/apiError";
import Reviews from "../models/Review.js";

dotenv.config();
const unauthorizedError = () => ApiError.unauthorized("You are not authorized to access this resource");

export const authenticate = (req, res, next) => {

    try {
        
        const authorization = req.headers.authorization;

        if (!authorization) {
            throw unauthorizedError();
        }

        const [ bearer, token ] = authorization.split(" ");

        if (bearer !== "Bearer" || !token) {
            throw unauthorizedError();
        }

        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decodedPayload;

        next();

    }

    catch (err) {
        next(err);
    }
}

export const requireAdmin = (req, res, next) => {

    if (!req.user) {
        return next(ApiError.unauthorized("Missing user credentials"));
    }
    
    const { role } = req.user;

    if (role !== "ADMIN") {
        return next(ApiError.forbidden("You need admin privileges to perform this operation"));
    }

    next();

};

export const requireReviewOwner = async (req, res, next) => {
    if (!req.user) {
        return next(ApiError.unauthorized("Missing user credentials"));
    }
    
    const { id } = req.params;

    try {
        const review = await Reviews.findByPk(id);
        if (!review) {
            throw ApiError.notFound(`Review with ID ${id} not found`);
        }
    
        const userId = review.user_id;
    
        if (userId !== req.user.id) {
            throw ApiError.forbidden(`You do not have permission to modify this review`);
        }

        req.review = review;
        
        next();
    }

    catch (err) {
        return next(err);
    }

};