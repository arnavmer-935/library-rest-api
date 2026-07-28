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
const PORT = process.env.PORT || 3000;

const accessLogStream = fs.createWriteStream(
    path.join("logs", "access.log"),
    { flags: "a" }
);

app.use(morgan("combined", {
    stream: accessLogStream
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

    console.error(err);

    if (err instanceof Sequelize.UniqueConstraintError) {

        const path = err.errors[0].path;
        const value = err.errors[0].value;
        const message = err.errors[0].message;

        let info;
        if (new Set("username", "email", "title").has(path)) {
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

        err = ApiError.badRequest("Validation error in Database entry", { path, value, message});

    }

    if (err instanceof jwt.TokenExpiredError || err instanceof jwt.JsonWebTokenError) {
        err = ApiError.unauthorized("Invalid credentials: Expired JWT");
    }

    if (err instanceof ApiError) {

        return res.status(err.code).json({

            "success": false,
            "error": {
                "type": err.type,
                "code": err.code,
                "message": err.message,
                "details": err.details
            }

        });

    } else {

        return res.status(500).json({
            "success": false,
            "error": {
                "type": "InternalServerError",
                "code": 500,
                "message": "Something went wrong",
                "details": null
            }
        });

    }
        

});

export default app;
