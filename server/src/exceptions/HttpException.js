const HttpException = (status, message) => {
    return {
        status: status,
        message: message,
    };
}

module.exports = {
    HttpException
};