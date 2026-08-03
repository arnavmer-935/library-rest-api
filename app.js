import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

import { Sequelize } from "sequelize";

import ApiError from "./services/apiError.js";
import gatewayRouter from "./routes/gateway.js";

const app = express();

const LOG_STREAM = fs.createWriteStream(
    path.join("logs", "access.log"),
    { flags: "a" }
);

app.use(morgan("combined", {
    stream: LOG_STREAM
}));

app.use(morgan("dev"));

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/v1/", gatewayRouter);

app.use((req, res, next) => {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {

    if (err instanceof Sequelize.UniqueConstraintError) {

        const path = err.errors[0].path;
        const value = err.errors[0].value;
        const message = err.errors[0].message;

        let info;
        if (new Set(["username", "email", "title"]).has(path)) {
            info = `${path} already exists`;
        }

        else {
            info = `Unique constraint violated`;
        }

        err = ApiError.conflict(info, { path, value, message });

    }

    if (err instanceof Sequelize.ValidationError) {

        const path = err.errors[0].path;
        const value = err.errors[0].value;
        const message = err.errors[0].message;

        err = ApiError.badRequest("Validation error in Database entry", { path, value, message });

    }

    if (err instanceof jwt.TokenExpiredError) {
        err = ApiError.unauthorized("JWT has expired. Please log in again.");
    }

    else if (err instanceof jwt.JsonWebTokenError) {
        err = ApiError.unauthorized("Invalid JWT");
    }

    if (err instanceof ApiError) {

        console.error({
            type: err.type,
            code: err.code,
            message: err.message,
            details: err.details
        });

        return res.status(err.code).json({
            "success": false,
            "error": {
                "type": err.type,
                "code": err.code,
                "message": err.message,
                "details": err.details
            }
        });

    }

    
    console.error(err);

    return res.status(500).json({
        "success": false,
        "error": {
            "type": "Internal Server Error",
            "code": 500,
            "message": "Something went wrong",
            "details": null
        }
    });

});

export default app;
