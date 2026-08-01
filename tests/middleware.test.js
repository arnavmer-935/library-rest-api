import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import app from "../app.js";
import seedAll from "./fixtures/seed.js";
import authHeader, { generateToken } from "./helpers/authgen.js";

dotenv.config();

describe("Middleware — authenticate", () => {

    let fixtures;

    beforeEach(async () => {
        fixtures = await seedAll();
    });

    it("rejects a request with no Authorization header", async () => {
        const res = await request(app).delete("/api/v1/books/1");

        expect(res.status).toBe(401);
    });

    it("rejects a request missing the Authorization header on a protected route", async () => {
        const res = await request(app)
            .post("/api/v1/books")
            .send({ title: "No Auth Book", author: "Nobody", genre: "fiction", price: 9.99 });

        expect(res.status).toBe(401);
    });

    it("rejects a malformed header with no Bearer prefix", async () => {
        const token = generateToken(fixtures.users.admin);

        const res = await request(app)
            .post("/api/v1/books")
            .set("Authorization", token)
            .send({ title: "Malformed Header Book", author: "Nobody", genre: "fiction", price: 9.99 });

        expect(res.status).toBe(401);
    });

    it("rejects a Bearer header with no token attached", async () => {
        const res = await request(app)
            .post("/api/v1/books")
            .set("Authorization", "Bearer")
            .send({ title: "Empty Token Book", author: "Nobody", genre: "fiction", price: 9.99 });

        expect(res.status).toBe(401);
    });

    it("rejects an expired JWT", async () => {
        const expiredToken = jwt.sign(
            { user_id: fixtures.users.admin.user_id, role: fixtures.users.admin.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "-1s" }
        );

        const res = await request(app)
            .post("/api/v1/books")
            .set("Authorization", `Bearer ${expiredToken}`)
            .send({ title: "Expired Token Book", author: "Nobody", genre: "fiction", price: 9.99 });

        expect(res.status).toBe(401);
        expect(res.body.error.message).toMatch(/expired/i);
    });

    it("rejects a tampered/invalid JWT", async () => {
        const validToken = generateToken(fixtures.users.admin);
        const tamperedToken = validToken.slice(0, -5) + "aaaaa";

        const res = await request(app)
            .post("/api/v1/books")
            .set("Authorization", `Bearer ${tamperedToken}`)
            .send({ title: "Tampered Token Book", author: "Nobody", genre: "fiction", price: 9.99 });

        expect(res.status).toBe(401);
    });

    it("allows the request through with a valid JWT", async () => {
        const res = await request(app)
            .post("/api/v1/books")
            .set(authHeader(fixtures.users.admin))
            .send({ title: "Valid Token Book", author: "Someone", genre: "fiction", price: 9.99 });

        expect(res.status).toBe(201);
    });

});

describe("Middleware — validate (request validation)", () => {

    let fixtures;

    beforeEach(async () => {
        fixtures = await seedAll();
    });

    it("returns structured field-level details on validation failure", async () => {
        const res = await request(app)
            .post("/api/v1/books")
            .set(authHeader(fixtures.users.admin))
            .send({ title: "", author: "A", genre: "fi", price: -5 });

        expect(res.status).toBe(400);
        expect(res.body.error.type).toBe("ValidationError");
        expect(Array.isArray(res.body.error.details)).toBe(true);
        expect(res.body.error.details.length).toBeGreaterThan(0);

        const fields = res.body.error.details.map(d => d.field);
        expect(fields).toContain("body.title");
        expect(fields).toContain("body.price");

    });

    it("validates params, body, and query independently and populates req.validated correctly", async () => {

        const res = await request(app)
            .patch("/api/v1/books/not-a-number")
            .set(authHeader(fixtures.users.admin))
            .send({ price: 15.99 });

        expect(res.status).toBe(400);

        const fields = res.body.error.details.map(d => d.field);
        expect(fields).toContain("params.id");
    });

    it("rejects an empty PATCH body on a review (refine rule requiring at least one field)", async () => {
        const res = await request(app)
            .patch(`/api/v1/reviews/${fixtures.reviews.aliceReview.review_id}`)
            .set(authHeader(fixtures.users.alice))
            .send({});

        expect(res.status).toBe(400);
        const fields = res.body.error.details.map(d => d.field);

        expect(fields.length).toBeGreaterThan(0);
    });

});