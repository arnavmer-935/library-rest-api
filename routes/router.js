import { Router } from "express";

import lower,
{ 
    paginate, fetchAllBooks, findByID, 
    getDataFromQuery, writeToStorage, 
    removeBook, getNextBookID, getNextReviewID,
    normalize, isDefined

} from "../services/utils.js";

import validate from "../middleware/validation.js";

import * as schemas from "../services/validator.js";
import ApiError from "../services/apiError.js";

const router = Router();

router.get("/", validate(schemas.querySchema, "query"), async (req, res, next) => {

    try {

        const data = await fetchAllBooks();

        const {response, page, limit } = getDataFromQuery(data, req.validated.query);

        const paginatedResponse = paginate(response, page, limit);

        res.status(200).send({
            "success": true,
            paginatedResponse
        });

    } catch (err) {

        next(err);

    }
    
});

router.get("/:id", validate(schemas.idParamSchema, "params"), async (req, res, next) => {

    const { id } = req.validated.params;

    try {

        const requiredBook = await findByID(id);

        res.status(200).send({
            "success": true,
            "message": `Book with ${id} found!`,
            "item": requiredBook
        });

    }

    catch (err) {
        next(err);
    }

});

router.get("/:id/reviews", validate(schemas.idParamSchema, "params"), async (req, res, next) => {

    const { id } = req.validated.params;

    try {

        const requiredBook = await findByID(id);

        res.status(200).send({
            "success": true,
            "message": `Found book with ID ${id}.`,
            "reviews": requiredBook.reviews
        });

    }

    catch (err) {
        next(err);
    }
});

router.post("/", validate(schemas.bookSchema, "body"), async (req, res, next) => {

    const { title, genre, price } = req.body;

    try {

        const existingData = await fetchAllBooks();

        const bookTitles = new Set(existingData.map(book => lower(book.title)));

        if (bookTitles.has(lower(title))) {
            throw ApiError.conflict(`Book titled \"${title}\" already exists in database`);
        }

        const book = {
            "id": getNextBookID(existingData),
            "title": title,
            "genre": genre,
            "reviews": [],
            "price": price
        };
        
        existingData.push(book);

        const updatedData = JSON.stringify(existingData);

        await writeToStorage(updatedData);

        res.status(201).send({
            "success": true,
            "message": "Book created successfully",
            "book-info": book
        });

    } catch (err) {
        next(err);
    }
});

router.post("/:id/reviews", validate(schemas.idParamSchema, "params"), 
            validate(schemas.reviewSchema, "body"), async (req, res, next) => {

    const { id } = req.validated.params;

    const { rating, comment } = req.body;

    try {

        const books = await fetchAllBooks();

        const requiredBook = books.find(book => book.id === id);

        if (!requiredBook) {
            throw ApiError.notFound(`Book with ID ${id} not found`);
        }

        const review = {
            "reviewId": getNextReviewID(books),
            "rating": rating,
            "comment": comment
        };

        requiredBook.reviews.push(review);

        const updatedData = JSON.stringify(books);

        await writeToStorage(updatedData);

        res.status(201).send({
            "success": true,
            "message": `Review with ${id} added successfully.`,
            "reviews": requiredBook.reviews
        });

    }

    catch (err) {
        next(err);
    }
});

router.patch("/:id", validate(schemas.idParamSchema, "params"),
                    validate(schemas.bookPatchSchema, "body"), async (req, res, next) => {

    const { id } = req.validated.params;

    try {

        const books = await fetchAllBooks();
        const book = books.find(b => b.id === id);

        if (!book) {
            throw ApiError.notFound(`Book with ID ${id} not found`);
        }

        if (isDefined(req.body.title)) {

            const titleChanged = normalizeTitle(book.title) !== normalizeTitle(req.body.title);

            if (titleChanged && book.reviews.length > 0) {
                throw ApiError.conflict(
                    "Cannot change title of a book that already has reviews"
                );
            }

            if (titleChanged) {
                const matchExists = books.some(
                    b => b.id !== id &&
                        normalize(b.title) === normalize(req.body.title)
                );

                if (matchExists) {
                    throw ApiError.conflict(
                        `Book titled "${req.body.title}" already exists in database`
                    );
                }
            }
        }

        Object.assign(book, req.body);

        const patchedBooks = JSON.stringify(books);
        await writeToStorage(patchedBooks);

        res.status(200).send({
            "success": true,
            "message": `Updated book with ID ${id}`,
            "updated-book": book
        });
    }

    catch (err) {
        next(err);
    }
});


router.delete("/:id", validate(schemas.idParamSchema, "params"), async (req, res, next) => {

    const { id } = req.validated.params;

    try {
        await removeBook(id);

        res.status(200).send({
            "success": true,
            "message": `Deleted book with ID ${id} successfully`
        });

    }

    catch (err) {
        next(err);
    }
});

export default router;