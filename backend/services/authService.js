import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/httpError.js';
import { listCollection, createRecord } from './dataStore.js';

const DEFAULT_SECRET = 'sentinel-demo-secret';

function signToken(user) {
  return jwt.sign(
    { sub: user._id, role: user.role, email: user.email, permissions: user.permissions },
    process.env.JWT_SECRET || DEFAULT_SECRET,
    { expiresIn: '8h' }
  );
}

export async function registerUser(input) {
  const users = listCollection('users');
  if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
    throw new HttpError(409, 'A user already exists with that email.');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = createRecord('users', {
    name: input.name,
    email: input.email,
    password: passwordHash,
    role: input.role || 'Employee',
    permissions: input.permissions || ['chat:use', 'documents:read'],
    status: 'active',
  });

  const token = signToken(user);
  return { user, token };
}

export async function authenticateUser(email, password) {
  const user = listCollection('users').find((entry) => entry.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new HttpError(401, 'Invalid credentials.');
  }

  const validPassword = user.password?.startsWith('$2')
    ? await bcrypt.compare(password, user.password)
    : password === user.password;
  if (!validPassword) {
    throw new HttpError(401, 'Invalid credentials.');
  }

  const token = signToken(user);
  return { user, token };
}

export function verifyUserToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || DEFAULT_SECRET);
  } catch {
    throw new HttpError(401, 'Invalid or expired token.');
  }
}