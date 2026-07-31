import { beforeEach, afterAll } from "vitest";
import sequelize from "../config/database.js";
import truncateAll  from "./fixtures/truncate.js";
import seedAll from "./fixtures/seed.js";

beforeEach(async () => {
    await truncateAll(); 
});

afterAll(async () => {
    await sequelize.close();
});