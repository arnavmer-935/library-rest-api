import Users from "./User.js";
import Books from "./Book.js";
import Reviews from "./Review.js";

Books.hasMany(Reviews, {
    foreignKey: "book_id"
});

Reviews.belongsTo(Books, {
    foreignKey: "book_id"
});

Reviews.belongsTo(Users, {
    foreignKey: "user_id"
});

Users.hasMany(Reviews, {
    foreignKey: "user_id"
});

export { Users, Books, Reviews };
