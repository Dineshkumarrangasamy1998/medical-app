import { v4 as uuidv4 } from "uuid";
import type { AuthUser, User } from "../types/users.type";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/constants';

const USERS_KEY = "users";
const AUTH_KEY = "authUser";

function readUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as User[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setAuthUser(user: AuthUser | null): void {
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
  try {
    window.dispatchEvent(
      new CustomEvent("auth:changed", { detail: { user } })
    );
  } catch {
    // no-op for non-browser environments
  }
}

export function getCurrentUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function registerUser(params: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser }>;
export async function registerUser(emailOrParams: any, maybePassword?: string) {
  const email =
    typeof emailOrParams === "string" ? emailOrParams : emailOrParams.email;
  const password =
    typeof emailOrParams === "string"
      ? (maybePassword as string)
      : emailOrParams.password;

  const users = readUsers();
  const exists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) throw new Error("Email already registered");

  const user: User = { id: uuidv4(), email, password, role: 'user' };
  users.push(user);
  writeUsers(users);

  const auth: AuthUser = { id: user.id, email: user.email, role: user.role || 'user' };
  // Do not auto-login on register to mirror current UX; keep account created only
  return { user: auth };
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser }>;
export async function loginUser(emailOrParams: any, maybePassword?: string) {
  const email =
    typeof emailOrParams === "string" ? emailOrParams : emailOrParams.email;
  const password =
    typeof emailOrParams === "string"
      ? (maybePassword as string)
      : emailOrParams.password;

  // Allow admin login without prior registration
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    const adminAuth: AuthUser = { id: 'admin', email: ADMIN_EMAIL, role: 'admin' };
    setAuthUser(adminAuth);
    return { user: adminAuth };
  }

  const users = readUsers();
  const found = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) throw new Error("Invalid email or password");

  const auth: AuthUser = { id: found.id, email: found.email, role: found.role || 'user' };
  setAuthUser(auth);
  return { user: auth };
}

export function logout(): void {
  setAuthUser(null);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function isAdmin(): boolean {
  return getCurrentUser()?.role === 'admin';
}

export function canModify(createdBy?: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (!createdBy) return false; // legacy record without owner -> only admin
  return createdBy === user.email;
}
