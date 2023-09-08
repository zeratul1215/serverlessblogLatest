const errorMiddleware = (error,req,res,next) => {

    const status = error.status || 500;
    const message = error.message || 'server error';

    res.status(status).json({
        code:54356,
        message
    });
}

module.exports = errorMiddleware;