import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import seedAll from "./fixtures/seed.js";
import authHeader from "./helpers/authgen.js";
import Reviews from "../models/Review.js";

describe("Reviews - /api/v1", () => {

    let fixtures;

    beforeEach(async () => {
        fixtures = await seedAll();
    });

    describe("POST /books/:id/reviews", () => {

        it("allows an authenticated user to add a review", async () => {
            const bookId = fixtures.books.bookNoReviews.book_id;

            const res = await request(app)
                .post(`/api/v1/books/${bookId}/reviews`)
                .set(authHeader(fixtures.users.bob))
                .send({ rating: 5, comment: "Loved it." });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.review.rating).toBe(5);
            expect(res.body.review.comment).toBe("Loved it.");
        });

        it("attaches the review to the authenticated user, ignoring any client-supplied user id", async () => {
            const bookId = fixtures.books.bookNoReviews.book_id;

            const res = await request(app)
                .post(`/api/v1/books/${bookId}/reviews`)
                .set(authHeader(fixtures.users.alice))
                .send({
                    rating: 4,
                    comment: "Trying to spoof this.",
                    userId: fixtures.users.admin.user_id
                });

            expect(res.status).toBe(201);
            expect(res.body.review.user_id).toBe(fixtures.users.alice.user_id);
            expect(res.body.review.user_id).not.toBe(fixtures.users.admin.user_id);
        });

        it("rejects an unauthenticated request", async () => {
            const bookId = fixtures.books.bookNoReviews.book_id;

            const res = await request(app)
                .post(`/api/v1/books/${bookId}/reviews`)
                .send({ rating: 5, comment: "No auth header." });

            expect(res.status).toBe(401);
            expect(res.body.error.type).toBe("Unauthorized");

        });

        it("rejects a rating outside the valid 1-5 range", async () => {

            const bookId = fixtures.books.bookNoReviews.book_id;

            const res = await request(app)
                .post(`/api/v1/books/${bookId}/reviews`)
                .set(authHeader(fixtures.users.bob))
                .send({ rating: 6, comment: "An IQ too high?" });

            expect(res.status).toBe(400);
            expect(res.body.error.type).toBe("ValidationError");

        });

        it("returns 404 when adding a review to a non-existent book", async () => {

            const badId = fixtures.books.bookNoReviews.book_id + 999;

            const res = await request(app)
                .post(`/api/v1/books/${badId}/reviews`)
                .set(authHeader(fixtures.users.bob))
                .send({ rating: 5, comment: "Ghost book." });

            expect(res.status).toBe(404);

        });

    });

    describe("PATCH /reviews/:id", () => {

        it("allows the owner to update their own review", async () => {
            const reviewId = fixtures.reviews.aliceReview.review_id;

            const res = await request(app)
                .patch(`/api/v1/reviews/${reviewId}`)
                .set(authHeader(fixtures.users.alice))
                .send({ rating: 2, comment: "Changed my mind." });

            expect(res.status).toBe(200);
            expect(res.body["updated-review"].rating).toBe(2);
        });

        it("forbids a non-owner from updating someone else's review", async () => {

            const reviewId = fixtures.reviews.aliceReview.review_id;

            const res = await request(app)
                .patch(`/api/v1/reviews/${reviewId}`)
                .set(authHeader(fixtures.users.bob))
                .send({ rating: 1, comment: "Not mine to edit." });

            expect(res.status).toBe(403);

        });

        it("forbids an admin from updating someone else's review", async () => {
            const reviewId = fixtures.reviews.aliceReview.review_id;

            const res = await request(app)
                .patch(`/api/v1/reviews/${reviewId}`)
                .set(authHeader(fixtures.users.admin))
                .send({ rating: 1, comment: "Admins shouldn't edit content." });

            expect(res.status).toBe(403);

        });

        it("rejects an empty patch body with no fields provided", async () => {
            const reviewId = fixtures.reviews.aliceReview.review_id;

            const res = await request(app)
                .patch(`/api/v1/reviews/${reviewId}`)
                .set(authHeader(fixtures.users.alice))
                .send({});

            expect(res.status).toBe(400);

        });

        it("returns 404 for a non-existent review ID", async () => {
            const badId = fixtures.reviews.aliceReview.review_id + 999;

            const res = await request(app)
                .patch(`/api/v1/reviews/${badId}`)
                .set(authHeader(fixtures.users.alice))
                .send({ rating: 3, comment: "Ghost review." });

            expect(res.status).toBe(404);
        });

    });

    describe("DELETE /reviews/:id", () => {

        it("allows the owner to delete their own review", async () => {
            const reviewId = fixtures.reviews.aliceReview.review_id;

            const res = await request(app)
                .delete(`/api/v1/reviews/${reviewId}`)
                .set(authHeader(fixtures.users.alice));

            expect(res.status).toBe(200);

            const remaining = await Reviews.findByPk(reviewId);
            expect(remaining).toBeNull();
        });

        it("forbids a non-owner, non-admin from deleting someone else's review", async () => {
            const reviewId = fixtures.reviews.aliceReview.review_id;

            const res = await request(app)
                .delete(`/api/v1/reviews/${reviewId}`)
                .set(authHeader(fixtures.users.bob));

            expect(res.status).toBe(403);
        });

        it("allows an admin to delete someone else's review", async () => {
            const reviewId = fixtures.reviews.aliceReview.review_id;

            const res = await request(app)
                .delete(`/api/v1/reviews/${reviewId}`)
                .set(authHeader(fixtures.users.admin));

            expect(res.status).toBe(200);

            const remaining = await Reviews.findByPk(reviewId);
            expect(remaining).toBeNull();
        });

        it("returns 404 for a non-existent review ID", async () => {
            const badId = fixtures.reviews.aliceReview.review_id + 999;

            const res = await request(app)
                .delete(`/api/v1/reviews/${badId}`)
                .set(authHeader(fixtures.users.admin));

            expect(res.status).toBe(404);
        });

    });

});