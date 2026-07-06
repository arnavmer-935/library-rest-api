import express from "express";
import cors from "cors";
import morgan from "morgan";
import ApiError from "./services/apiError.js";
import router from "./router/router.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/books", router);

app.use((req, res, next) => {
    next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {

    if (err instanceof ApiError) {

        return res.status(err.code).send({

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

    res.status(500).send({
        "success": false,
        "error": {
            "type": "InternalServerError",
            "code": 500,
            "message": "Something went wrong",
            "details": null
        }
    });

});
app.listen(PORT, () => console.log(`Library API listening on ${PORT}`));
