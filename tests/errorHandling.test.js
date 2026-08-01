import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Error Handling", () => {

    it("returns a structured JSON 404 for an unknown route, not Express's default HTML page", async () => {
        const res = await request(app).get("/api/v1/this-route-does-not-exist");

        expect(res.status).toBe(404);
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.body.success).toBe(false);
        expect(res.body.error.type).toBe("Not Found");
        expect(res.body.error.code).toBe(404);
        
    });

});