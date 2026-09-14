import { nanoid } from 'nanoid';
import { mockStore, cloneRecord } from '../utils/mockStore.js';

function collection(name) {
  return mockStore[name];
}

export function listCollection(name) {
  return cloneRecord(collection(name));
}

export function findById(name, id) {
  return cloneRecord(collection(name).find((item) => item._id === id) || null);
}

export function createRecord(name, payload) {
  const record = { _id: nanoid(), ...payload, createdAt: new Date().toISOString() };
  collection(name).unshift(record);
  return cloneRecord(record);
}

export function updateRecord(name, id, patch) {
  const items = collection(name);
  const index = items.findIndex((item) => item._id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...patch, updatedAt: new Date().toISOString() };
  return cloneRecord(items[index]);
}

export function removeRecord(name, id) {
  const items = collection(name);
  const index = items.findIndex((item) => item._id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}