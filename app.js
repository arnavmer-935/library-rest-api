import express from "express";
import cors from "cors";
import morgan from "morgan";
import ApiError from "./services/apiError.js";
import bookRouter from "./router/router.js";
import { Sequelize } from "sequelize";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/v2/books", booksRouter);

app.use((req, res, next) => {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {

    console.error(err);

    if (err instanceof SequelizeUniqueConstraintError) {

        const path = err.errors[0].path;
        const value = err.errors[0].value;
        const message = err.errors[0].message;

        err = ApiError.conflict("Book title already taken", { path, value, message });

    }

    if (err instanceof SequelizeValidationError) {

        const path = err.errors[0].path;
        const value = err.errors[0].value;
        const message = err.errors[0].message;

        err = ApiError.badRequest("Validation error in Database entry", { path, value, message});

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
