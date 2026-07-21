import sequelize from "../config/database.js";
import { Op } from "Sequelize";

import { getDataFromQuery } from "../services/utils";
import { Users, Books, Reviews } from "../models/associations.js";
import { isDefined } from "../services/utils";


export const getBooks = async (req, res, next) => {

    try {
        const options = getDataFromQuery(req.validated.query);
        const books = await Books.findAll(options);

        return res.status(200).json({
            success: true,
            books
        });
    }

    catch (err) {
        next(err);
    }

}

export const getBookByID = async (req, res, next) => {
    try {
        const { id } = req.validated.params;
        const book = await Books.findByPk(id);

        if (!book) {
            throw ApiError.notFound(`Book with ID ${id} not found.`);
        }

        return res.status(200).json({
            success: true,
            book
        });
    }

    catch (err) {
        next(err);
    }
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

