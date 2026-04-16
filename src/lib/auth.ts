import bcryptjs from 'bcryptjs';
const { compareSync } = bcryptjs;
import { getUserByEmail, createSession, getSession, deleteSession } from './db';
import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'cibai_session';

export function login(email: string, password: string): string | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (!compareSync(password, user.password)) return null;
  return createSession(user.id);
}

export function getAuthUser(cookies: AstroCookies) {
  const sessionId = cookies.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  return getSession(sessionId);
}

export function setSessionCookie(cookies: AstroCookies, sessionId: string) {
  cookies.set(COOKIE_NAME, sessionId, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  const sessionId = cookies.get(COOKIE_NAME)?.value;
  if (sessionId) deleteSession(sessionId);
  cookies.delete(COOKIE_NAME, { path: '/' });
}
