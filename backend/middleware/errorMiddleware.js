import { HttpError } from '../utils/httpError.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Unexpected server error';
  res.status(statusCode).json({
    success: false,
    message,
    details: error.details || null,
  });
}