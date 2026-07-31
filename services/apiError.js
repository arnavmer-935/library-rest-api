export default class ApiError extends Error {

    constructor(type, message, code, details = null) {

        super(message);
        this.type = type;
        this.code = code;
        this.details = details;

    }

    static notFound(message, details = null) {
        return new ApiError("Not Found", message, 404, details);
    }

    static badRequest(message, details = null) {
        return new ApiError("Bad Request", message, 400, details);
    }

    static conflict(message, details = null) {
        return new ApiError("Conflict", message, 409, details);
    }

    static unauthorized(message, details = null) {
        return new ApiError("Unauthorized", message, 401, details);
    }

    static forbidden(message, details = null) {
        return new ApiError("Forbidden", message, 403, details);
    }

    static toJSON(err) {

        const type = err.type || "Internal Server Error";
        const code = err.code;
        const message = err.message || "Something went wrong";
        const details = err.details || null;

        return {

            "success": false,
            "error": {
                type,
                code,
                message,
                details
            }

        };
    }

}