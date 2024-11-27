const appError = require("../utils/appError");

const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    res.status(statusCode).json({
        status,
        message,
        stack,
    })
}

const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if(error.isOperational) {
        return res.status(statusCode).json({
            status,
            message,
        })
    }

    return res.status(500).json({
        status: 'error',
        message: 'Something Went Wrong'
    })
}

const globalErrorHandler = (err, req, res, next) => {
    if(err.name === 'JsonWebTokenError') {
        err = new appError('Invalid Token', 401)
    }
    if(err.name === 'SequelizeValidationError') {
        err = new appError(err.errors[0].message, 400)
    }
    if(err.name === 'SequelizeUniqueConstraintError') {
        err = new appError(err.errors[0].message, 400)
    }
    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    sendErrorProd(err, res); 
}

module.exports = globalErrorHandler;