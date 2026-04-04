class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message); // ✅ fixed
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message); // ✅ fixed name + code
  }
}

export default ApiError;