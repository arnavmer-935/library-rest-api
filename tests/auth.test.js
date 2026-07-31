import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { jwt } from "zod";
import seedAll from "./fixtures/seed.js";

describe("Authentication - /api/v1/auth", () => {

    let fixtures;

    beforeEach(async () => {
        fixtures = await seedAll();
    });

    describe("POST /register", () => {

        it ("registers a new user successfully", async () => {

            const requestBody = { username: "thenewguy", email: "brandnewguy@example.com", password: "hiyakiddos"};
            const res = await request(app).post("/api/v1/auth/register").send(requestBody);

            expect(res.body.success).toBe(true);
            expect(res.status).toBe(201);
            expect(res.body.user.username).toBe("thenewguy");
            expect(res.body.user).not.toHaveProperty("passwordHash");
        });

        it ("throws a conflict error when the username already exists", async () => {

            const user = { username: "alice", email: "whyalwaysbobandalice@gmail.com", password: "heeheeheeha"};

            const { body } = await request(app).post("/api/v1/auth/register").send(user);

            expect(body.success).toBe(false);
            expect(body.error.type).toBe("Conflict");
            expect(body.error.code).toBe(409);
            expect(body.error.details.path).toBe("username");

        });

        it ("throws a conflict error when the email already exists", async () => {

            const user = { username: "aliceimpersonator", email: "alice@gmail.com", password: "password@123"};

            const { body } = await request(app).post("/api/v1/auth/register").send(user);

            expect(body.success).toBe(false);
            expect(body.error.type).toBe("Conflict");
            expect(body.error.code).toBe(409);
            expect(body.error.details.path).toBe("email");

        })
    });

    describe("POST /login", () => {

        it ("returns 200 OK with a JWT for a valid username and password", async () => {

            const creds = { identifier: "alice", password: "testpassword123" };

            const res = await request(app).post("/api/v1/auth/login").send(creds);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);

        });

        it ("returns 200 OK with a JWT for a valid email and password", async () => {

            const creds = { identifier: "alice@gmail.com", password: "testpassword123" };

            const res = await request(app).post("/api/v1/auth/login").send(creds);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);

        });

        it ("returns 401 Bad Request for a valid identifier and invalid password", async () => {

            const badCreds = { identifier: "alice@gmail.com", password: "ooooooiamgarbagepasswooorddd"};

            const res = await request(app).post("/api/v1/auth/login").send(badCreds);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error.type).toBe("Unauthorized");

        });

        it ("returns 401 Bad Request for an invalid identifier", async () => {

            const badCreds = { identifier: "real_admin", password: "testpassword123"};

            const res = await request(app).post("/api/v1/auth/login").send(badCreds);

            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
            expect(res.body.error.type).toBe("Unauthorized");

        });

        
    })
    
})