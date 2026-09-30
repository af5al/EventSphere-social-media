const ApiError = require("../util/ApiError");

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Handle common known errors
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // Mongoose bad ObjectId
    if (error.name === "CastError") {
      message = `Resource not found with id of ${error.value}`;
      statusCode = 404;
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      message = `Duplicate value entered for ${field}`;
      statusCode = 409;
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      message = Object.values(error.errors || {})
        .map((val) => val.message)
        .join(", ");
      statusCode = 400;
    }

    // JWT errors
    if (error.name === "JsonWebTokenError") {
      message = "Invalid authentication token";
      statusCode = 401;
    }
    if (error.name === "TokenExpiredError") {
      message = "Authentication token expired";
      statusCode = 401;
    }

    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    error: error.message, // For backwards compatibility with older client checks
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;
