import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import ApiError from "./apiError.js";
import { deprecate } from "util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STORAGE_PATH = path.join(__dirname, "../storage", "books.json");

const lower = (str) => str.toLowerCase();
export const isDefined = (data) => data !== undefined;
export const normalize = (str) => str.trim().replace(/\s+/g, " ").toLowerCase();

export default lower;

const SORT_FIELDS = ["title", "genre", "price"];

export async function writeToStorage(data) {
    await fs.writeFile(STORAGE_PATH, data);
}

export function getDataFromQuery(queryParams) {

    const { genre, sortBy, minPrice, maxPrice, order, page, limit } = queryParams;

    let whereClauses = {};

    if (isDefined(genre)) {
        whereClauses.genre = genre;
    }

    if (isDefined(minPrice) && isDefined(maxPrice)) {
        whereClauses.price = { [Op.between] : [minPrice, maxPrice] };
    }

    else if (isDefined(minPrice)) {
        whereClauses.price = { [Op.gte] : minPrice };
    }

    else if (isDefined(maxPrice)) {
        whereClauses.price = { [Op.lte] : maxPrice };
    }

    orderClause = [
        [sortBy, order.toUpperCase()]
    ];

    limitClause = limit;
    offsetClause = (page - 1) * limit;

    let options = {};

    options.where = whereClauses;
    options.order = orderClauses;
    options.limit = limitClause;
    options.offset = offsetClause;

    return options;

}


export function getNextBookID(books) {

    const bookIDs = books.map(b => b.id);

    return Math.max(...bookIDs, 0) + 1;

}

export function getNextReviewID(books) {

    const reviews = books.flatMap(b => b.reviews);
    const reviewIDs = reviews.map(r => r.reviewId);

    return Math.max(...reviewIDs, 0) + 1;
}

function getAverageRating(book) {

    const cleanedReviews = book.reviews.filter(r => r.rating);

    if (cleanedReviews.length === 0) return null;

    const total = cleanedReviews.reduce((total, r) => total + r.rating, 0);
    return total / cleanedReviews.length;

}