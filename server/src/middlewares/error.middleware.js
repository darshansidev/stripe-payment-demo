const { ValidationError } = require('express-validation');
const { HttpException } = require('../exceptions/HttpException');

const errorMiddleware = async (error, req, res, next) => {

    try {
        if (error instanceof ValidationError) {
            const validationErr = validationErrCheckerSingle(error);
            const status = error.status || 400;
            const message = error.message || 'Validation error';
            res.status(status).json({ status: status, message: validationErr });
            return;
        }

        if (error === HttpException) {
            const status = error.status || 500;
            const message = error.message || 'Something went wrong';
            res.status(status).json({ message });
            return;
        }
        if (error.message === 'invalid signature') {
            return res.status(401).json({ status: 401, message: 'Invalid token signature' });
        }

        const status = error.status || 500;
        const message = error.message || 'Something went wrong';
        res.status(status).json({ status: status, message: message });
    } catch (error) {
        next(error);
    }
};

const validationErrCheckerSingle = (err) => {
    // this type of message get from validation error:- '"password" is required'
    //that reason for create this function and convert message in single string without any [' "]
    let message = err.details.body[0].message.replace(/['"]+/g, '');
    return message;
};

module.exports = errorMiddleware;