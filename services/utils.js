import { where } from "sequelize";

const lower = (str) => str.toLowerCase();

export const isDefined = (data) => data !== undefined;

export default lower;

export function getDataFromQuery(queryParams) {

    const { author, genre, sortBy, minPrice, maxPrice, order, limit, page } = queryParams;

    let whereClauses = {};

    if (isDefined(author)) {
        whereClauses.author = author;
    }
    
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

    let orderClauses;
    if (isDefined(sortBy)) {
        orderClauses = [
            [sortBy, isDefined(order) ? order.toUpperCase() : "ASC"]
        ];
    }

    let options = {};

    if (whereClauses){
        options.where = whereClauses;
    }

    if (isDefined(orderClauses)) {
        options.order = orderClauses;
    }

    options.limit = limit;
    options.offset = (page - 1) * limit;

    return options;

}

export function getPaginationMetadata(query, count, length) {
    const page = query.page;
    const limit = query.limit;
    const returned = length;
    const total = count;
    const pages = Math.ceil(count / limit);
    const hasNextPage = page < pages;
    const hasPreviousPage = page > 1;

    return { page, limit, returned, total, pages, hasNextPage, hasPreviousPage };

}
