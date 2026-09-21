import { asyncHandler } from '../utils/asyncHandler.js';
import { createRecord, listCollection, removeRecord, updateRecord } from '../services/dataStore.js';
import { evaluatePrompt } from '../services/securityService.js';
import { generateAiResponse as generateGeminiResponse } from '../services/geminiService.js';
import { generateGemmaResponse } from '../services/gemmaService.js';
import { successResponse } from '../utils/response.js';
import { HttpError } from '../utils/httpError.js';

import fs from 'fs';
import path from 'path';

export const sendChat = asyncHandler(async (req, res) => {
  const { prompt = '', history = [], apiKey, conversationId, documentNames = [] } = req.body;
  const passedKey = apiKey || req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
  const security = evaluatePrompt(prompt, { userId: req.user?._id, route: '/api/chat', ip: req.ip });

  if (security.label === 'JAILBREAK') {
    throw new HttpError(403, 'Your request was blocked by Sentinel AI 2.0 security controls.', security.logEntry);
  }

  // Determine desired provider: request body -> env AI_PROVIDER -> default gemini
  const requested = req.body.provider || process.env.AI_PROVIDER || 'gemini';
  let response;
  if (requested === 'gemma') {
    response = await generateGemmaResponse(prompt, { history, documentNames, apiKey: passedKey });
  } else {
    response = await generateGeminiResponse(prompt, { history, documentNames, apiKey: passedKey });
  }
  const historyEntry = {
    userId: req.user?._id || 'anonymous',
    title: prompt.slice(0, 48) || 'New Conversation',
    messages: [
      ...(Array.isArray(history) ? history : []),
      { role: 'user', content: prompt, timestamp: new Date().toISOString() },
      { role: 'assistant', content: response.text, timestamp: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const chat = conversationId ? updateRecord('chats', conversationId, historyEntry) : createRecord('chats', historyEntry);
  successResponse(res, { chat, response, security }, 'Chat response generated');
});

export const getKeyStatus = asyncHandler(async (_req, res) => {
  const envKey = process.env.GEMINI_API_KEY || '';
  const masked = envKey ? `${envKey.slice(0, 6)}...${envKey.slice(-4)}` : '';
  successResponse(res, {
    configured: Boolean(envKey),
    maskedKey: masked,
    provider: process.env.AI_PROVIDER || 'gemini',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  });
});

export const saveApiKey = asyncHandler(async (req, res) => {
  const { apiKey, model = 'gemini-1.5-flash' } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 8) {
    throw new HttpError(400, 'Please provide a valid Gemini API Key from Google AI Studio.');
  }

  const cleanKey = apiKey.trim();
  process.env.GEMINI_API_KEY = cleanKey;
  if (model) process.env.GEMINI_MODEL = model;

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }
    if (envContent.includes('GEMINI_API_KEY=')) {
      envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${cleanKey}`);
    } else {
      envContent += `\nGEMINI_API_KEY=${cleanKey}`;
    }
    if (!envContent.includes('GEMINI_MODEL=')) {
      envContent += `\nGEMINI_MODEL=${model}`;
    } else {
      envContent = envContent.replace(/GEMINI_MODEL=.*/g, `GEMINI_MODEL=${model}`);
    }
    fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');
  } catch (e) {
    console.warn('Could not write to .env file, retained in memory:', e.message);
  }

  successResponse(res, {
    configured: true,
    maskedKey: `${cleanKey.slice(0, 6)}...${cleanKey.slice(-4)}`,
    model,
  }, 'Gemini API Key configured and saved successfully.');
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