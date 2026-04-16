import bcryptjs from 'bcryptjs';
const { hashSync } = bcryptjs;
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', '..', 'data');
const USERS_FILE = join(DATA_DIR, 'users.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Session {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadUsers(): User[] {
  ensureDataDir();
  if (!existsSync(USERS_FILE)) {
    // Create default superadmin
    const defaultUsers: User[] = [{
      id: uuidv4(),
      email: 'matias@cibergeda.com',
      password: hashSync('12345678', 10),
      name: 'Matias',
      role: 'superadmin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }];
    writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    return defaultUsers;
  }
  return JSON.parse(readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users: User[]) {
  ensureDataDir();
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function loadSessions(): Session[] {
  ensureDataDir();
  if (!existsSync(SESSIONS_FILE)) {
    writeFileSync(SESSIONS_FILE, '[]');
    return [];
  }
  return JSON.parse(readFileSync(SESSIONS_FILE, 'utf-8'));
}

function saveSessions(sessions: Session[]) {
  ensureDataDir();
  writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

// User operations
export function getUserByEmail(email: string): User | undefined {
  return loadUsers().find(u => u.email === email);
}

export function getUserById(id: string): Omit<User, 'password'> | undefined {
  const user = loadUsers().find(u => u.id === id);
  if (!user) return undefined;
  const { password, ...rest } = user;
  return rest;
}

export function getAllUsers(): Omit<User, 'password'>[] {
  return loadUsers().map(({ password, ...rest }) => rest);
}

export function createUser(email: string, password: string, name: string, role: string = 'editor') {
  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('UNIQUE constraint failed: email');
  }
  const newUser: User = {
    id: uuidv4(),
    email,
    password: hashSync(password, 10),
    name,
    role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return getUserById(newUser.id);
}

export function updateUser(id: string, data: { email?: string; name?: string; role?: string; password?: string }) {
  const users = loadUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return undefined;

  if (data.email && data.email !== users[index].email) {
    if (users.find(u => u.email === data.email && u.id !== id)) {
      throw new Error('UNIQUE constraint failed: email');
    }
    users[index].email = data.email;
  }
  if (data.name) users[index].name = data.name;
  if (data.role) users[index].role = data.role;
  if (data.password) users[index].password = hashSync(data.password, 10);
  users[index].updated_at = new Date().toISOString();

  saveUsers(users);
  return getUserById(id);
}

export function deleteUser(id: string) {
  const users = loadUsers().filter(u => u.id !== id);
  saveUsers(users);
  // Also clean up sessions
  const sessions = loadSessions().filter(s => s.user_id !== id);
  saveSessions(sessions);
}

// Session operations
export function createSession(userId: string): string {
  const sessions = loadSessions();
  const sessionId = uuidv4();
  sessions.push({
    id: sessionId,
    user_id: userId,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  });
  saveSessions(sessions);
  return sessionId;
}

export function getSession(sessionId: string) {
  const sessions = loadSessions();
  const session = sessions.find(s => s.id === sessionId && new Date(s.expires_at) > new Date());
  if (!session) return null;

  const users = loadUsers();
  const user = users.find(u => u.id === session.user_id);
  if (!user) return null;

  return {
    ...session,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function deleteSession(sessionId: string) {
  const sessions = loadSessions().filter(s => s.id !== sessionId);
  saveSessions(sessions);
}
