import { asyncHandler } from '../utils/asyncHandler.js';
import { predictWithModel } from '../services/mlService.js';
import { successResponse } from '../utils/response.js';

export const predictPrompt = asyncHandler(async (req, res) => {
  const prompt = req.body.prompt || '';
  const result = await predictWithModel(prompt);
  successResponse(res, result);
});