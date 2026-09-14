import { asyncHandler } from '../utils/asyncHandler.js';
import { createRecord, listCollection, removeRecord, updateRecord } from '../services/dataStore.js';
import { evaluatePrompt } from '../services/securityService.js';
import { generateAiResponse as generateGeminiResponse } from '../services/geminiService.js';
import { generateGemmaResponse } from '../services/gemmaService.js';
import { successResponse } from '../utils/response.js';
import { HttpError } from '../utils/httpError.js';

export const sendChat = asyncHandler(async (req, res) => {
  const { prompt = '', conversationId, documentNames = [] } = req.body;
  const security = evaluatePrompt(prompt, { userId: req.user?._id, route: '/api/chat', ip: req.ip });

  if (security.label === 'JAILBREAK') {
    throw new HttpError(403, 'Your request was blocked by Sentinel AI 2.0 security controls.', security.logEntry);
  }

  // Determine desired provider: request body -> env AI_PROVIDER -> default gemini
  const requested = req.body.provider || process.env.AI_PROVIDER || 'gemini';
  let response;
  if (requested === 'gemma') {
    response = await generateGemmaResponse(prompt, { documentNames });
  } else {
    response = await generateGeminiResponse(prompt, { documentNames });
  }
  const historyEntry = {
    userId: req.user?._id || 'anonymous',
    title: prompt.slice(0, 48) || 'New Conversation',
    messages: [
      { role: 'user', content: prompt, timestamp: new Date().toISOString() },
      { role: 'assistant', content: response.text, timestamp: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const chat = conversationId ? updateRecord('chats', conversationId, historyEntry) : createRecord('chats', historyEntry);
  successResponse(res, { chat, response, security }, 'Chat response generated');
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = listCollection('chats').filter((chat) => chat.userId === req.user?._id || true);
  successResponse(res, history);
});

export const deleteHistory = asyncHandler(async (req, res) => {
  const deleted = removeRecord('chats', req.params.id);
  successResponse(res, { deleted }, deleted ? 'Conversation deleted' : 'Conversation not found');
});

export const renameHistory = asyncHandler(async (req, res) => {
  const updated = updateRecord('chats', req.params.id, { title: req.body.title });
  successResponse(res, updated, 'Conversation renamed');
});

export const exportHistory = asyncHandler(async (_req, res) => {
  const chats = listCollection('chats');
  res.setHeader('Content-Disposition', 'attachment; filename="sentinel-chat-history.json"');
  res.json(chats);
});