import Users from "./User.js";
import Books from "./Book.js";
import Reviews from "./Review.js";

Books.hasMany(Reviews, {
    foreignKey: "book_id",
    as: "reviews"
});

Reviews.belongsTo(Books, {
    foreignKey: "book_id"
});

Reviews.belongsTo(Users, {
    foreignKey: "user_id"
});

Users.hasMany(Reviews, {
    foreignKey: "user_id",
    as: "reviews"
});

export { Users, Books, Reviews };
