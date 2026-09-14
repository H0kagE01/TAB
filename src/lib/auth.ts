import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

const configuredJwtSecret = process.env.JWT_SECRET;

if (!configuredJwtSecret && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET must be set in production');
}

const JWT_SECRET = new TextEncoder().encode(
  configuredJwtSecret || 'konfetnica-super-secret-jwt-key-2026'
);

export const COOKIE_NAME = 'tav_admin_token';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Sign JWT token for admin session (valid for 7 days)
 */
export async function createSessionToken(payload: AuthSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

/**
 * Verify JWT token
 */
export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get current authenticated admin session from cookies
 */
export async function getCurrentAdminSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Authenticate admin by email and password
 */
export async function authenticateAdmin(email: string, password: string): Promise<{ user: AuthSession; token: string } | null> {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (isValid) {
        const session: AuthSession = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
        const token = await createSessionToken(session);
        return { user: session, token };
      }
    }
  } catch (error) {
    console.warn('Database connection unavailable during authenticateAdmin, checking fallback admin');
  }

  // Fallback default admin credentials when DB is unavailable or user table is not populated
  if (
    process.env.NODE_ENV !== 'production' &&
    (normalizedEmail === 'admin@tav-coffee.ru' || normalizedEmail === 'admin@konfetnica.ru') &&
    password === 'admin123456'
  ) {
    const session: AuthSession = {
      userId: 'usr_admin_default',
      email: normalizedEmail,
      name: 'Администратор ТАВ',
      role: 'ADMIN',
    };
    const token = await createSessionToken(session);
    return { user: session, token };
  }

  return null;
}
