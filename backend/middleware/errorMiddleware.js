/**
 * Centralized error handler middleware.
 * Catches all errors thrown in route handlers and returns
 * a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(`❌ [${req.method}] ${req.originalUrl} — ${err.message}`);

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = { errorHandler };
