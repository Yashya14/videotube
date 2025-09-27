const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };

/**
 * Wraps an async request handler to catch errors and pass them to the next middleware.
 * @param {Function} requestHandler - The async request handler function.
 * @returns {Function} - The wrapped request handler.
 */

/**
 * asyncHandler is a higher-order function for Express route handlers.
 * It wraps an async request handler and automatically catches any errors,
 * passing them to Express's error-handling middleware via next(error).
 *
 * Usage:
 * app.get('/route', asyncHandler(async (req, res, next) => {
 *   // your async code here
 * }));
 *
 * This avoids repetitive try-catch blocks in each async route.
 */

/*
const asyncHandler = (requestHandler) => {
    try {
        await requestHandler(req, res, next);
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

*/
