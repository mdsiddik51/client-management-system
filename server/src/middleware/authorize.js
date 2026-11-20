import { errorResponse } from '../utils/response.js';

/**
 * authorize(...roles) – returns middleware that rejects if req.user.role is not in roles.
 * @param  {...string} roles  Allowed roles, e.g. authorize('ADMIN') or authorize('ADMIN','CLIENT')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden – insufficient permissions', 403);
    }
    next();
  };
};
