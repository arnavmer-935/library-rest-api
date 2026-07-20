import ApiError from "../services/apiError.js";

const validate = (schema, target) => (req, res, next) => {

    const parsed = schema.safeParse(req[target]);
    console.log(parsed) 

    if (!parsed.success) {
        const errorDetails = parsed.error.issues.map(issue => ({
            field: `${target}.${issue.path.join('.')}`,
            message: issue.message
        }));

        const err = new ApiError("ValidationError", "Validation Failed", 400, errorDetails);
        return next(err);
    }

    req.validated = req.validated || {};
    req.validated[target] = parsed.data;

    next();

}

export default validate;