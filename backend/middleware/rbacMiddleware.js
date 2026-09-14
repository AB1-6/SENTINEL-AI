import { HttpError } from '../utils/httpError.js';

export function allowRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role) && !req.user.permissions?.includes('*')) {
      return next(new HttpError(403, 'You do not have permission to access this resource.'));
    }

    next();
  };
}