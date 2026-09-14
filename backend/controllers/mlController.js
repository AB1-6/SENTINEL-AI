import { asyncHandler } from '../utils/asyncHandler.js';
import { calculatePromptRisk } from '../utils/security.js';
import { successResponse } from '../utils/response.js';

export const predictPrompt = asyncHandler(async (req, res) => {
  const prompt = req.body.prompt || '';
  const result = calculatePromptRisk(prompt);
  successResponse(res, result);
});