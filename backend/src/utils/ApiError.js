// This class is used to create custom error objects for API responses.
// It lets you add a message, status code, and extra error details.
// You can use this to send better error messages from your backend.

class ApiError extends Error {
  constructor(
    message = "Something went wrong", // Error message
    statusCode,                      // HTTP status code (like 404, 500, etc.)
    errors = [],                     // Extra error details (optional)
    stack = ""                       // Stack trace (optional)
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;                // You can add extra data here if needed
    this.message = message;
    this.success = false;            // Always false for errors
    this.errors = errors;

    if (stack) {
        this.stack = stack;          // Use custom stack if provided
    } else {
        Error.captureStackTrace(this, this.constructor); // Otherwise, capture current stack
    }
  }
}

export { ApiError };