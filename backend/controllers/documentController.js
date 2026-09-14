import fs from 'fs';
import path from 'path';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRecord, listCollection, removeRecord } from '../services/dataStore.js';
import { summarizeDocument } from '../services/documentService.js';
import { successResponse } from '../utils/response.js';

export const uploadDocument = asyncHandler(async (req, res) => {
  const file = req.file;
  const summary = await summarizeDocument(file);
  const document = createRecord('documents', {
    userId: req.user?._id,
    originalName: file.originalname,
    filename: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    path: `/api/documents/${file.filename}`,
    summary: summary.summary,
  });
  successResponse(res, { document, summary }, 'Document uploaded', 201);
});

export const getDocuments = asyncHandler(async (_req, res) => {
  successResponse(res, listCollection('documents'));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const documents = listCollection('documents');
  const target = documents.find((document) => document._id === req.params.id);
  if (target) {
    const filePath = path.resolve(`backend/uploads/${target.filename}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  const deleted = removeRecord('documents', req.params.id);
  successResponse(res, { deleted }, deleted ? 'Document deleted' : 'Document not found');
});