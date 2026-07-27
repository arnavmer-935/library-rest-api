import sequelize from "../config/database.js";
import Users from "../models/User.js";
import Reviews from "../models/Review.js";

const users = [
    {
        username: "alice",
        email: "alice@example.com",
        passwordHash: "hashedpasswordHash"
    },
    {
        username: "bob",
        email: "bob@example.com",
        passwordHash: "hashedpasswordHash"
    },
    {
        username: "charlie",
        email: "charlie@example.com",
        passwordHash: "hashedpasswordHash"
    },
    {
        username: "diana",
        email: "diana@example.com",
        passwordHash: "hashedpasswordHash"
    },
    {
        username: "eve",
        email: "eve@example.com",
        passwordHash: "hashedpasswordHash"
    },
    {
        username: "frank",
        email: "frank@example.com",
        passwordHash: "hashedpasswordHash"
    },
    {
        username: "grace",
        email: "grace@example.com",
        passwordHash: "hashedpasswordHash"
    },
    {
        username: "henry",
        email: "henry@example.com",
        passwordHash: "hashedpasswordHash"
    }
];

const reviews = [
    {
        rating: 5.0,
        comment: "A timeless fantasy masterpiece.",
        user_id: 1,
        book_id: 7
    },
    {
        rating: 4.5,
        comment: "Loved every chapter.",
        user_id: 2,
        book_id: 7
    },
    {
        rating: 5.0,
        comment: "An incredible start to the trilogy.",
        user_id: 3,
        book_id: 8
    },
    {
        rating: 4.0,
        comment: "Great pacing and worldbuilding.",
        user_id: 4,
        book_id: 9
    },
    {
        rating: 5.0,
        comment: "Still frighteningly relevant.",
        user_id: 5,
        book_id: 10
    },
    {
        rating: 4.5,
        comment: "Must-read for software engineers.",
        user_id: 1,
        book_id: 11
    },
    {
        rating: 5.0,
        comment: "Changed how I write code.",
        user_id: 6,
        book_id: 12
    },
    {
        rating: 4.0,
        comment: "Simple ideas executed well.",
        user_id: 7,
        book_id: 13
    },
    {
        rating: 4.5,
        comment: "Excellent productivity advice.",
        user_id: 8,
        book_id: 14
    },
    {
        rating: 5.0,
        comment: "Couldn't put it down.",
        user_id: 2,
        book_id: 15
    },
    {
        rating: 4.5,
        comment: "Beautifully written.",
        user_id: 3,
        book_id: 16
    },
    {
        rating: 5.0,
        comment: "One of Sanderson's best.",
        user_id: 4,
        book_id: 18
    },
    {
        rating: 5.0,
        comment: "Absolutely massive but worth it.",
        user_id: 5,
        book_id: 19
    },
    {
        rating: 3.5,
        comment: "Interesting twist ending.",
        user_id: 6,
        book_id: 20
    },
    {
        rating: 4.5,
        comment: "Very inspiring memoir.",
        user_id: 7,
        book_id: 21
    },
    {
        rating: 4.0,
        comment: "Would recommend.",
        user_id: 8,
        book_id: 9
    },
    {
        rating: 5.0,
        comment: "Fantastic read.",
        user_id: 1,
        book_id: 18
    },
    {
        rating: 3.5,
        comment: "Good but a little slow.",
        user_id: 2,
        book_id: 19
    },
    {
        rating: 4.0,
        comment: "Worth reading again.",
        user_id: 3,
        book_id: 15
    },
    {
        rating: 4.5,
        comment: "Excellent storytelling.",
        user_id: 4,
        book_id: 8
    }
];

async function seed() {
    try {
        await sequelize.authenticate();

        // Uncomment if you want a clean slate each run.
        // await Reviews.destroy({ where: {}, truncate: true });
        // await Users.destroy({ where: {}, truncate: true });

        // await Users.bulkCreate(users);
        // console.log(`Inserted ${users.length} users.`);

        await Reviews.bulkCreate(reviews);
        console.log(`Inserted ${reviews.length} reviews.`);

        console.log("Seeding completed successfully.");
    } catch (err) {
        console.error("Seeding failed:");
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

seed();