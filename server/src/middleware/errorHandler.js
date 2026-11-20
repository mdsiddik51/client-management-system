import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/response.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, path: req.path });

  // Mongoose CastError (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid value for field: ${err.path}`, 400);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, 'Validation failed', 422, errors);
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return errorResponse(res, `Duplicate value for ${field}`, 409);
  }

  // Generic
  const statusCode = err.statusCode || err.status || 500;
  return errorResponse(res, err.message || 'Internal server error', statusCode);
};

export default errorHandler;
