
const lower = (str) => str.toLowerCase();

export const isDefined = (data) => data !== undefined;

export const normalize = (str) => str.trim().replace(/\s+/g, " ").toLowerCase();

export default lower;

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
