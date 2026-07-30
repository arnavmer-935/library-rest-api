import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./tests/setup.js"],
        globals: false,
        testTimeout: 10000
    }
});