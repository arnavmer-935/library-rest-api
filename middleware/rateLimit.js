import rateLimit from "express-rate-limit";

const AUTH_LIMIT_WINDOW_MS = 900000;
const OP_LIMIT_WINDOW_MS = 60000;

const BASE_OPTIONS = {
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Too many requests. Please try again later."
    }
};

export const authLimiter = rateLimit({
    ...BASE_OPTIONS,
    windowMs: AUTH_LIMIT_WINDOW_MS,
    max: 5
});

export const readLimiter = rateLimit({
    ...BASE_OPTIONS,
    windowMs: OP_LIMIT_WINDOW_MS,
    max: 100
});

export const writeLimiter = rateLimit({
    ...BASE_OPTIONS,
    windowMs: OP_LIMIT_WINDOW_MS,
    max: 20
});