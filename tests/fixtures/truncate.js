import sequelize from "../../config/database.js";
import Reviews from "../../models/Review.js";
import Books from "../../models/Book.js";
import Users from "../../models/User.js";

const truncateAll = async () => {
    try {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

        await Reviews.truncate();
        await Books.truncate();
        await Users.truncate();
        
    } finally {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    }
};

export default truncateAll;
