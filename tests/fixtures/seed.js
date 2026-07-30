import bcrypt from "bcrypt";
import Users from "../../models/User.js";
import Books from "../../models/Book.js";
import Reviews from "../../models/Review.js";

const PASSWORD = "testpassword123";
const passwordHash = await bcrypt.hash(PASSWORD, 10);

const seedAll = async () => {
    const alice = await Users.create({
        username: "alice",
        email: "alice@example.com",
        passwordHash,
        role: "USER"
    });

    const bob = await Users.create({
        username: "bob",
        email: "bob@example.com",
        passwordHash,
        role: "USER"
    });

    const admin = await Users.create({
        username: "admin",
        email: "admin@example.com",
        passwordHash,
        role: "ADMIN"
    });

    const bookNoReviews = await Books.create({
        title: "Untouched Title",
        author: "Some Author",
        genre: "fiction",
        price: 12.99
    });

    const bookWithReviews = await Books.create({
        title: "Reviewed Title",
        author: "Another Author",
        genre: "non-fiction",
        price: 24.99
    });

    const aliceReview = await Reviews.create({
        rating: 4.5,
        comment: "Pretty solid read.",
        user_id: alice.user_id,
        book_id: bookWithReviews.book_id
    });

    return {
        users: { alice, bob, admin },
        books: { bookNoReviews, bookWithReviews },
        reviews: { aliceReview },
        rawPassword: PASSWORD
    };
};

export default seedAll;