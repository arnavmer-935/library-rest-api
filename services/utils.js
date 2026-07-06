import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import ApiError from "./apiError";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STORAGE_PATH = path.join(__dirname, "../storage", "books.json");

const lower = (str) => str.toLowerCase();
const isDefined = (data) => data !== undefined;
export const normalize = (str) => str.trim().replace(/\s+/g, " ").toLowerCase();

export default lower;

const SORT_FIELDS = ["title", "genre", "price", "avgrating"];

export async function fetchAllBooks() {

    const data = await fs.readFile(STORAGE_PATH, { encoding: "utf8" });

    const dataArray = JSON.parse(data);

    return dataArray;

}

export function paginate(responseArray, page, limit) {

    const total = responseArray.length;
    const startIndex = (page - 1) * limit;
    const resultSet = responseArray.slice(startIndex, startIndex + limit);
    const pageCount = Math.ceil(total / limit);

    return {
        "total-matches": total,
        "paginated-result": resultSet,
        "pages": pageCount, 
    };

}

export async function findByID(id) {

    const data = await fetchAllBooks();

    const matchingIndex = data.findIndex(book => book.id === id);

    if (matchingIndex === -1) throw ApiError.notfound(`Book with ID ${id} not found.`);

    else return data[matchingIndex];

}

export function getDataFromQuery(data, queryParams) {

    const { genre, sortBy, minPrice, maxPrice, 
        minAvgRating, maxAvgRating, order, page, limit } = queryParams;

    let response = [...data];

    if (isDefined(genre)) {
        response = response.filter(book => lower(book.genre) === genre);
    }

    if (isDefined(minAvgRating)) {
        response = response.filter(book => {
            const avg = getAverageRating(book);
            return avg !== null && avg >= minAvgRating;
        });
    }

    if (isDefined(maxAvgRating)) {
        response = response.filter(book => {
            const avg = getAverageRating(book);
            return avg !== null && avg <= maxAvgRating;
        });
    }

    if (isDefined(minPrice)) { response = response.filter(book => book.price >= minPrice); }
    if (isDefined(maxPrice)) { response = response.filter(book => book.price <= maxPrice); }

    sort(response, sortBy, order);
        
    return { response, page, limit };

}

export async function writeToStorage(data) {
    await fs.writeFile(STORAGE_PATH, data);
}

function sort(response, sortBy, order) {

    if (sortBy === "price") {

        response.sort((a, b) => {
            return order === "asc" ? a.price - b.price: b.price - a.price;
        });
    }

    else if (SORT_FIELDS.slice(0, 2).includes(sortBy)) {
        response.sort((a,b) => {
            return order === "asc" ? a[sortBy].localeCompare(b[sortBy]) :
            b[sortBy].localeCompare(a[sortBy]);
        });
    }

    else if (sortBy === "avgrating") {

        response.sort((a,b) => {

            const avg1 = getAverageRating(a);
            const avg2 = getAverageRating(b);

            if (avg1 === null && avg2 === null) return 0;
            if (avg1 === null) return 1;
            if (avg2 === null) return -1;

            return order === "asc" ? avg1 - avg2 : avg2 - avg1;
        });

    }

    else return;

}

export async function removeBook(id) {

    const books = await fetchAllBooks();

    const removeIdx = books.findIndex(b => b.id === id);

    if (removeIdx === -1) throw ApiError.notFound(`Book with ID ${id} not found.`,);

    else {
        books.splice(removeIdx, 1);

        const newData = JSON.stringify(books);

        await writeToStorage(newData);

    }

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