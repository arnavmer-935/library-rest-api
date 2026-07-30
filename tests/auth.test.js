import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("POST /api/v1/auth", () => {

    describe("POST /register", () => {

        it ("registers a new user successfully", async () => {

            const requestBody = { username: "alexam", email: "alice@example.com", password: "ilikeyacutg"};
            const res = await request(app).post("/api/v1/auth/register").send(requestBody);

            expect(res.body.success).toBe(true);
            expect(res.status).toBe(201);
        })
    })
    
})