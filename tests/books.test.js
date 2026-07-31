import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import seedAll from "./fixtures/seed.js";
import { authHeader } from "./helpers/authgen.js";

describe("Books — /api/v1/", () => {

    let fixtures;

    beforeEach(async () => {
        fixtures = await seedAll();
    });

    describe("GET /books", () => {

        it ("returns 200 OK with a books array and pagination object", async () => {

            const res = await request(app).get("/api/v1/books");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("pagination");
            expect(res.body.books).toBeInstanceOf(Array);
            expect(res.body.books.length).toBe(2);


        });

        it ("returns 200 OK with books of a genre passed in URL parameter", async () => {

            const res = await request(app).get("/api/v1/books?genre=fiction");

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("pagination");
            expect(res.body.books.length).toBe(1);
            expect(res.body.books[0].genre).toBe("fiction");

        });

        it ("filters books by price range", async () => {

            const res = await request(app).get("/api/v1/books").query({
                "minPrice": 15,
                "maxPrice": 30
            });

            const body = res.body
            
            expect(res.status).toBe(200);
            expect(body).toHaveProperty("pagination");
            expect(body.books.length).toBe(1);
            expect(body.books[0].price).toBeGreaterThanOrEqual(15);
            expect(body.books[0].price).toBeLessThanOrEqual(30);
            expect(body.books[0].title).toBe("Reviewed Title")
        });

        it ("sorts in descending order of price", async () => {

            const res = await request(app).get("/api/v1/books").query({
                "sortBy": "price",
                "order": "desc"
            });

            const body = res.body

            expect(res.status).toBe(200);
            expect(body.books[0].price).toBeGreaterThan(body.books[1].price);

        });

        it ("maintains pagination boundaries", async () => {

            const res = await request(app).get("/api/v1/books?page=11");

            const body = res.body

            expect(res.status).toBe(400);
            expect(body.success).toBe(false);
            expect(body.error.type).toBe("ValidationError");


        });

        it ("throws error on invalid sort field", async () => {

            const res = await request(app).get("/api/v1/books?sortBy=nonsense");

            const body = res.body

            expect(res.status).toBe(400);
            expect(body.success).toBe(false);
            expect(body.error.type).toBe("ValidationError");

        });

        it ("indicates case insensitivity for sort fields", async () => {

            const res = await request(app).get("/api/v1/books?sortBy=PRICE");

            const body = res.body

            expect(res.status).toBe(200);
            expect(body.success).toBe(true);
            expect(body.books[0].price).toBeLessThanOrEqual(body.books[1].price);

        });
    })

});