import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Rate limiting", () => {

    it("blocks the 6th auth request within the 15-minute window", async () => {
        const original = process.env.NODE_ENV;
        process.env.NODE_ENV = "development";

        try {
            for (let i = 0; i < 5; i++) {
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({ identifier: "nobody", password: "wrongpass" });
            }

            const res = await request(app)
                .post("/api/v1/auth/login")
                .send({ identifier: "nobody", password: "wrongpass" });

            expect(res.status).toBe(429);
        } finally {
            process.env.NODE_ENV = original;
        }
    });

});