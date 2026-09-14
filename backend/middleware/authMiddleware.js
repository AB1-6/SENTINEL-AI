import { HttpError } from '../utils/httpError.js';
import { verifyUserToken } from '../services/authService.js';
import { listCollection } from '../services/dataStore.js';

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return next(new HttpError(401, 'Authentication token is required.'));
  }

  const payload = verifyUserToken(token);
  const user = listCollection('users').find((entry) => entry._id === payload.sub);
  if (!user) {
    return next(new HttpError(401, 'Session is no longer valid.'));
  }

  req.user = user;
  req.tokenPayload = payload;
  next();
}