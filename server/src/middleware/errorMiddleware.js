/**
 * Error Middleware - Application Layer
 * Centralized error handler to catch all unhandled exceptions and return 
 * professional, consistent JSON responses.
 */
const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error(`[Error] ${err.stack}`);

    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorMiddleware;
