export function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function errorResponse(res, message, statusCode = 500, details = null) {
  return res.status(statusCode).json({ success: false, message, details });
}