import ApiError from "../services/apiError";

const validate = (schema, target) => (req, res, next) => {

    const parsed = schema.safeParse(req[target]);

    if (!parsed.success) {
        const errorDetails = parsed.error.issues.map(issue => ({
            field: `${target}.${issue.path.join('.')}`,
            message: issue.message
        }));

        const err = new ApiError("ValidationError", "Validation Failed", 400, errorDetails);
        return next(err);
    }

    req[target] = parsed.data;

    next();

}

export default validate;