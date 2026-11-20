import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../lib/betterAuth.js';
import { errorResponse } from '../utils/response.js';

const authenticate = async (req, res, next) => {
  try {
    const auth = getAuth();
    if (!auth) {
      return errorResponse(res, 'Auth service unavailable', 503);
    }
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session || !session.user) {
      return errorResponse(res, 'Unauthorized – please log in', 401);
    }
    req.user = session.user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
