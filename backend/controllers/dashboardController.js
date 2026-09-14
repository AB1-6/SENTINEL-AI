import { asyncHandler } from '../utils/asyncHandler.js';
import { buildSecurityStatus } from '../services/securityService.js';
import { listCollection } from '../services/dataStore.js';
import { successResponse } from '../utils/response.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  const chats = listCollection('chats');
  const documents = listCollection('documents');
  const users = listCollection('users');
  const security = buildSecurityStatus();

  successResponse(res, {
    overview: {
      conversationsToday: chats.length * 214,
      documentsUploaded: documents.length,
      blockedJailbreakAttempts: security.blockedPrompts,
      activeUsers: users.filter((user) => user.status === 'active').length,
    },
    recentActivity: chats[0]?.messages?.slice(-5) || [],
    alerts: security.alerts,
    security,
  });
});