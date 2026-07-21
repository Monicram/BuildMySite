/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error("[ERROR]", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // PostgreSQL duplicate key error
  if (err.code === "23505") {
    statusCode = 400;
    message = "Duplicate record already exists.";
  }

  // PostgreSQL foreign key violation
  if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference data.";
  }

  // PostgreSQL invalid input
  if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid input.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

module.exports = errorHandler;