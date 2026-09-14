import { asyncHandler } from '../utils/asyncHandler.js';
import { buildSecurityStatus } from '../services/securityService.js';
import { successResponse } from '../utils/response.js';

export const getSecurityStatus = asyncHandler(async (_req, res) => {
  successResponse(res, buildSecurityStatus());
});

export const getSecurityLogs = asyncHandler(async (_req, res) => {
  const status = buildSecurityStatus();
  successResponse(res, status.securityLogs);
});

export const getSecurityAlerts = asyncHandler(async (_req, res) => {
  const status = buildSecurityStatus();
  successResponse(res, status.alerts);
});