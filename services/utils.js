import { where } from "sequelize";

const lower = (str) => str.toLowerCase();

export const isDefined = (data) => data !== undefined;

export const normalize = (str) => str.trim().replace(/\s+/g, " ").toLowerCase();

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

    console.log(options); //SUS
    return options;

}
