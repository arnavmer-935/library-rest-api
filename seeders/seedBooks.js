import sequelize from "../config/database.js";
import Books from "../models/Book.js";

const books = [
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        price: 14.99
    },
    {
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        price: 16.99
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        price: 18.50
    },
    {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        price: 11.99
    },
    {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        genre: "Programming",
        price: 42.99
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: "Programming",
        price: 38.50
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self Help",
        price: 21.99
    },
    {
        title: "Deep Work",
        author: "Cal Newport",
        genre: "Productivity",
        price: 19.99
    },
    {
        title: "The Martian",
        author: "Andy Weir",
        genre: "Science Fiction",
        price: 15.99
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Classic",
        price: 12.99
    },
    {
        title: "The Name of the Wind",
        author: "Patrick Rothfuss",
        genre: "Fantasy",
        price: 17.99
    },
    {
        title: "Mistborn",
        author: "Brandon Sanderson",
        genre: "Fantasy",
        price: 18.99
    },
    {
        title: "The Way of Kings",
        author: "Brandon Sanderson",
        genre: "Fantasy",
        price: 24.99
    },
    {
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "Thriller",
        price: 13.99
    },
    {
        title: "Educated",
        author: "Tara Westover",
        genre: "Memoir",
        price: 16.49
    }
];

async function seed() {
    try {
        await sequelize.authenticate();

        await Books.bulkCreate(books);

        console.log(`Inserted ${books.length} books.`);
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
}

seed();