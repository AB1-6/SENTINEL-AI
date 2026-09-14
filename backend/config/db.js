import mongoose from 'mongoose';

let databaseReady = false;

export async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('MONGO_URI is not set. Starting in demo mode with the in-memory store.');
    return false;
  }

  if (databaseReady) {
    return true;
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  databaseReady = true;
  console.log('MongoDB connected');
  return true;
}

export function isDatabaseReady() {
  return databaseReady;
}