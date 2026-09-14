import { asyncHandler } from '../utils/asyncHandler.js';
import { createRecord, listCollection, removeRecord, updateRecord } from '../services/dataStore.js';
import { successResponse } from '../utils/response.js';

export const getUsers = asyncHandler(async (_req, res) => {
  successResponse(res, listCollection('users').map(({ password, ...user }) => user));
});

export const createUser = asyncHandler(async (req, res) => {
  const user = createRecord('users', req.body);
  const { password, ...safeUser } = user;
  successResponse(res, safeUser, 'User created', 201);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = updateRecord('users', req.params.id, req.body);
  const { password, ...safeUser } = user || {};
  successResponse(res, safeUser, 'User updated');
});

export const deleteUser = asyncHandler(async (req, res) => {
  const deleted = removeRecord('users', req.params.id);
  successResponse(res, { deleted }, deleted ? 'User deleted' : 'User not found');
});