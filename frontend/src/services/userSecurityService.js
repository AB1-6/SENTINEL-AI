/**
 * Sentinel AI 2.0 - Zero-Trust User Security & Strike Service
 * Enforces the 3-strike adversarial violation policy and Super Admin readmission workflow.
 */

const STORAGE_KEY = 'sentinel.users_v2';
const STRIKE_LIMIT = 3;

// Initial enterprise directory
const INITIAL_USERS = [
  {
    id: 'user-admin',
    name: 'Anlin Punne',
    email: 'anlinpunneli@gmail.com',
    role: 'Super Administrator',
    clearance: 'Level 5 (Full Control)',
    status: 'Active (Owner)',
    strikes: 0,
    maxStrikes: STRIKE_LIMIT,
    violations: [],
    avatar: 'AP',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-analyst',
    name: 'Alex Mercer',
    email: 'alex.mercer@sentinel.local',
    role: 'Lead Security Engineer',
    clearance: 'Level 4 (SecOps)',
    status: 'Active',
    strikes: 0,
    maxStrikes: STRIKE_LIMIT,
    violations: [],
    avatar: 'AM',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-compliance',
    name: 'Elena Rostova',
    email: 'elena.rostova@sentinel.local',
    role: 'Compliance Officer',
    clearance: 'Level 3 (Audit)',
    status: 'Active',
    strikes: 0,
    maxStrikes: STRIKE_LIMIT,
    violations: [],
    avatar: 'ER',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-employee',
    name: 'David Kim',
    email: 'employee@sentinel.local',
    role: 'Standard Employee',
    clearance: 'Level 2 (Workspace)',
    status: 'Active',
    strikes: 0,
    maxStrikes: STRIKE_LIMIT,
    violations: [],
    avatar: 'DK',
    createdAt: new Date().toISOString(),
  },
];

const listeners = new Set();

function notifyListeners() {
  const users = getUsers();
  listeners.forEach((fn) => {
    try {
      fn(users);
    } catch (e) {
      console.warn('Listener error:', e);
    }
  });
}

export function subscribeUserSecurity(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getUsers() {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    notifyListeners();
  } catch (e) {
    console.warn('Failed to save users:', e);
  }
}

export function getUser(email) {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === clean) || null;
}

export function isUserSuspended(email) {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  // Super Admin cannot be suspended
  if (clean === 'anlinpunneli@gmail.com') return false;

  const user = getUser(clean);
  if (!user) return false;
  return user.status === 'Suspended' || user.strikes >= STRIKE_LIMIT;
}

/**
 * Records a security violation for an account.
 * When strikes reach 3, automatically suspends the account.
 */
export function recordViolation(email, promptText, classification = {}) {
  if (!email) return { strikes: 0, suspended: false };
  const clean = email.trim().toLowerCase();
  
  // Super admin is exempt from strike lockout
  if (clean === 'anlinpunneli@gmail.com') {
    return { strikes: 0, suspended: false, isSuperAdmin: true };
  }

  const users = getUsers();
  let userIndex = users.findIndex((u) => u.email.toLowerCase() === clean);

  // If user doesn't exist, create an employee entry
  if (userIndex === -1) {
    const newUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email: clean,
      role: 'Standard Employee',
      clearance: 'Level 2',
      status: 'Active',
      strikes: 0,
      maxStrikes: STRIKE_LIMIT,
      violations: [],
      avatar: email.slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    userIndex = users.length - 1;
  }

  const user = { ...users[userIndex] };
  const nextStrikes = Math.min((user.strikes || 0) + 1, STRIKE_LIMIT);
  const isSuspended = nextStrikes >= STRIKE_LIMIT;

  const violationEntry = {
    id: `viol-${Date.now()}`,
    timestamp: new Date().toISOString(),
    promptSnippet: (promptText || '').slice(0, 100),
    label: classification.label || 'JAILBREAK_ATTEMPT',
    score: classification.score || 0.95,
    strikeNumber: nextStrikes,
  };

  user.strikes = nextStrikes;
  user.violations = [violationEntry, ...(user.violations || [])];
  user.lastViolation = new Date().toISOString();

  if (isSuspended) {
    user.status = 'Suspended';
    user.suspendedAt = new Date().toISOString();
    user.suspendedReason = `Exceeded 3 Zero-Trust Security Violations (${violationEntry.label})`;
  }

  users[userIndex] = user;
  saveUsers(users);

  return {
    strikes: nextStrikes,
    maxStrikes: STRIKE_LIMIT,
    suspended: isSuspended,
    user,
    violation: violationEntry,
  };
}

/**
 * Super Administrator Readmission Action:
 * Reinstates access, resets strike counter to 0, and restores status to Active.
 */
export function readmitUser(email, adminEmail = 'anlinpunneli@gmail.com') {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === clean);

  if (userIndex === -1) return null;

  const user = { ...users[userIndex] };
  user.status = 'Active';
  user.strikes = 0;
  user.reinstatedAt = new Date().toISOString();
  user.reinstatedBy = adminEmail;
  user.suspendedAt = null;
  user.suspendedReason = null;

  users[userIndex] = user;
  saveUsers(users);

  return user;
}

/**
 * Super Administrator manual strike simulation for testing/demo purposes
 */
export function simulateUserStrike(email) {
  return recordViolation(email, 'Simulated Red-Team Prompt Injection [Demo Probe]', {
    label: 'SIMULATED_JAILBREAK',
    score: 0.99,
  });
}

/**
 * Resets all users to initial state
 */
export function resetAllUserSecurity() {
  saveUsers(INITIAL_USERS);
  return INITIAL_USERS;
}
