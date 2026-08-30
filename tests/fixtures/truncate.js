import sequelize from "../../config/database.js";
import Reviews from "../../models/Review.js";
import Books from "../../models/Book.js";
import Users from "../../models/User.js";

const truncateAll = async () => {
    await Reviews.truncate({ cascade: true });
    await Books.truncate({ cascade: true });
    await Users.truncate({ cascade: true });
};

export default truncateAll;
