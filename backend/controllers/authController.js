import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticateUser, registerUser } from '../services/authService.js';
import { successResponse } from '../utils/response.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const payload = await authenticateUser(email, password);
  successResponse(res, payload, 'Login successful');
});

export const register = asyncHandler(async (req, res) => {
  const payload = await registerUser(req.body);
  successResponse(res, payload, 'Registration successful', 201);
});

export const logout = asyncHandler(async (_req, res) => {
  successResponse(res, { loggedOut: true }, 'Logout successful');
});