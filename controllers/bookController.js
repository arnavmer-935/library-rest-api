import sequelize from "../config/database.js";
import { Op } from "sequelize";

import { getDataFromQuery } from "../services/utils.js";
import { Users, Books, Reviews } from "../models/associations.js";
import { isDefined, getPaginationMetadata } from "../services/utils.js";

import ApiError from "../services/apiError.js";

export const getBooks = async (req, res, next) => {

    try {
        const options = getDataFromQuery(req.validated.query);
        const { count, rows: books } = await Books.findAndCountAll(options);
        const pagination = getPaginationMetadata(req.validated.query, count, books.length);

        return res.status(200).json({
            "success": true,
            "message": `Fetched ${books.length} books from database`,
            pagination,
            books: books.map(b => b.toJSON())
        });
    }

    catch (err) {
        next(err);
    }

}

export const getBookByID = async (req, res, next) => {
    try {
        const { id } = req.validated.params;

        const book = await Books.findByPk(id, {
            include: [{
                model: Reviews,
                as: "reviews"
            }]
        });

        if (!book) {
            throw ApiError.notFound(`Book with id ${id} not found.`);
        }

        return res.status(200).json({
            "success": true,
            "message": `Book with id ${id} retrieved`,
            "book": book.toJSON()
        });
    }

    catch (err) {
        next(err);
    }
}

export const getReviewsByBookID = async (req, res, next) => {

    try {
        const { id } = req.validated.params;

        const book = await Books.findByPk(id, { raw: true });

        if (!book) {
            throw ApiError.notFound(`Book with id ${id} does not exist in database`);
        }

        const reviews = await Reviews.findAll({
            where: {
                book_id: id
            },

            raw: true
        });

        let message;
        if (reviews.length == 0) {
            message = `No reviews for found for book with id ${id}`;
        }

        else {
            message = `Reviews for book with id ${id} retrieved. Found ${reviews.length} reviews.`;
        }

        return res.status(200).json({
            "success": true,
            message,
            "title": book.title,
            "author": book.author,
            reviews
        });
    }

    catch (err) {
        next(err);
    }

}

export const createBook = async (req, res, next) => {

    const { title, author, genre, price } = req.validated.body;

    try {

        const createdBook = await Books.create({
            title,
            author,
            genre,
            price
        });

        if (!createdBook) {
            throw ApiError.conflict(`Book titled \"${title}\" already exists in database`);
        }

        return res.status(201).json({
            "success": true,
            "message": "Book created successfully",
            "book": createdBook.toJSON()
        });

    } catch (err) {
        next(err);
    }
};

export const addReview = async (req, res, next) => {

    const { id } = req.validated.params;

    const { rating, comment } = req.validated.body;

    try {

        const requiredBook = await Books.findByPk(id);

        if (!requiredBook) {
            throw ApiError.notFound(`Book with ID ${id} not found`);
        }

        const createdReview = await Reviews.create({
            rating,
            comment,
            user_id: req.user.user_id,
            book_id: id
        });

        return res.status(201).send({
            "success": true,
            "message": `Review added for book id ${id}`,
            "review": createdReview.toJSON()
        });

    }

    catch (err) {
        next(err);
    }
}

export const updateBookByID = async (req, res, next) => {

    const { id } = req.validated.params;

    const { title, author, genre, price} = req.validated.body;

    try {

        const requiredBook = await Books.findByPk(id, {
            include: {
                model: Reviews,
                as: "reviews"
            }
        });

        if (!requiredBook) {
            throw ApiError.notFound(`Book with ID ${id} not found`);
        }

        if (isDefined(title)) {

            if (requiredBook.dataValues.reviews.length > 0) {
                throw ApiError.conflict("Cannot change title of a book that already has reviews");
            }

            else {
                requiredBook.title = title;
            }

        }

        if (isDefined(author)) {
            requiredBook.author = author;
        }

        if (isDefined(genre)) {
            requiredBook.genre = genre;
        }

        if (isDefined(price)) {
            requiredBook.price = price;
        }

        await requiredBook.save();

        return res.status(200).send({
            "success": true,
            "message": `Updated book with ID ${id}`,
            "book": requiredBook.toJSON()
        });

    }

    catch (err) {
        next(err);
    }
};

export const removeBookByID = async (req, res, next) => {

    try {

        const { id } = req.validated.params;

        const book = await Books.destroy({
            where: {
                book_id: id
            }
        });

        if (!book) {
            throw ApiError.notFound(`Book with id ${id} not found`)
        }

        return res.status(204).json();

    }

    catch (err) {
        next(err);
    }

}


