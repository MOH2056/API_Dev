class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
class NotFoundError extends CustomError {
    constructor(message = 'Not found Error') {
        super(message, 404);
    }
}

class BadRequestError extends CustomError {
    constructor(message = 'Bad request error') {
        super(message, 400);
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized error') {
        super(message, 401);
    }
}

class ForbiddenError extends CustomError {
    constructor(message = 'Access forbidden error') {
        super(message, 403);
    }
}

class ConflictError extends CustomError {
    constructor(message = 'Conflict error') {
        super(message, 409);
    }
}



const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[Error] ${message}`);
    res.status(statusCode).json({
        message,
        status: statusCode < 500 ? 'Error' : 'Failure',
        status_code: statusCode,
    });
};


export {CustomError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError, ConflictError, errorHandler}
