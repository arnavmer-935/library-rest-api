// seed-prod.js
// One-time seeder for the production database.
// Run with: railway run node seed-prod.js
//
// Safe to re-run: checks for existing data first and skips seeding if
// books already exist, so you won't hit the unique `title` constraint
// or create duplicate users by accident.

import "dotenv/config";
import bcrypt from "bcrypt";
import sequelize from "./config/database.js"; // adjust path if this file lives elsewhere
import Books from "./models/Book.js";
import Users from "./models/User.js";
import Reviews from "./models/Review.js";
import "./models/associations.js";

// Set these via env vars rather than hardcoding, so no real password
// ever sits in source control.
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
const USER_PASSWORD = process.env.SEED_USER_PASSWORD || "ChangeMe123!";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Connected to database.");

    const existingBookCount = await Books.count();
    if (existingBookCount > 0) {
      console.log(
        `Database already has ${existingBookCount} book(s) — skipping seed. ` +
        `Delete existing data first if you want to reseed from scratch.`
      );
      process.exit(0);
    }

    // 1. Admin user
    const admin = await Users.create({
      username: "admin",
      email: "admin@example.com",
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      role: "ADMIN",
    });

    // 2. Regular user
    const alice = await Users.create({
      username: "alice",
      email: "alice@example.com",
      passwordHash: await bcrypt.hash(USER_PASSWORD, 10),
      role: "USER",
    });

    // 3. Books (admin-managed, per RBAC rules)
    const books = await Books.bulkCreate([
      {
        title: "The Pragmatic Programmer",
        author: "David Thomas & Andrew Hunt",
        genre: "Technology",
        price: 39.99,
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: "Technology",
        price: 34.99,
      },
      {
        title: "Dune",
        author: "Frank Herbert",
        genre: "Science Fiction",
        price: 18.5,
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        genre: "Science Fiction",
        price: 22.0,
      },
    ]);

    // 4. A review, owned by alice (matches the "reviews owned by JWT user" rule)
    await Reviews.create({
      book_id: books[0].book_id,
      user_id: alice.user_id,
      rating: 5,
      comment: "Changed how I think about writing software.",
    });

    console.log(`Seeded: 2 users, ${books.length} books, 1 review.`);
    console.log(`Admin login -> username: admin, password: ${ADMIN_PASSWORD}`);
    console.log(`User login  -> username: alice, password: ${USER_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
