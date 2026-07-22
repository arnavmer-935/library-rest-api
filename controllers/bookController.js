import sequelize from "../config/database.js";
import { Op } from "Sequelize";

import { getDataFromQuery } from "../services/utils";
import { Users, Books, Reviews } from "../models/associations.js";
import { isDefined } from "../services/utils";

export const getBooks = async (req, res, next) => {

    try {
        const options = getDataFromQuery(req.query);
        const books = await Books.findAll(options);

        return res.status(200).json({
            "success": true,
            "message": `Fetched ${books.length} books from database`,
            "books": books.dataValues
        });
    }

    catch (err) {
        next(err);
    }

}

export const getBookByID = async (req, res, next) => {
    try {
        const { id } = req.params;

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
            "book": book.dataValues
        });
    }

    catch (err) {
        next(err);
    }
}

export const getReviewsByBookID = async (req, res, next) => {

    try {
        const { id } = req.params;

        const reviews = await Reviews.findAll({
            where: {
                book_id: id
            }
        });

        if (!reviews) {
            throw ApiError.notFound(`Reviews not found for book with id ${id}`);
        }

        return res.status(200).json({
            "success": true,
            "message": `Reviews for book with id ${id} retrieved. Found ${reviews.length} reviews.`,
            "reviews": reviews.dataValues
        });
    }

    catch (err) {
        next(err);
    }

}

export const createBook = async (req, res, next) => {

    const { title, author, genre, price } = req.body;

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
            "book-info": createdBook.dataValues
        });

    } catch (err) {
        next(err);
    }
};

export const addReview = async (req, res, next) => {

    const { id } = req.params;

    const { userId, rating, comment } = req.body;

    try {

        const requiredBook = await Books.findByPk(id);

        if (!requiredBook) {
            throw ApiError.notFound(`Book with ID ${id} not found`);
        }

        const createdReview = await Reviews.create({
            rating,
            comment,
            user_id: userId,
            book_id: id
        });

        res.status(201).send({
            "success": true,
            "message": `Review added for book id ${id}`,
            "review": createdReview.dataValues
        });

    }

    catch (err) {
        next(err);
    }
}

export const updateBookByID = async (req, res, next) => {

    const { id } = req.params;

    const { title, author, genre, price} = req.body;

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

        res.status(200).send({
            "success": true,
            "message": `Updated book with ID ${id}`,
            "updated-book": requiredBook
        });

    }

    catch (err) {
        next(err);
    }
};

export const removeBookByID = async (req, res, next) => {

    try {

        const { id } = req.params;

        const book = await Books.destroy({
            where: {
                book_id: id
            }
        });

        return res.status(204).json({
            "success": true,
            "message": `Deleted Book with id ${id} successfully`
        });

    }

    catch (err) {
        next(err);
    }

}


