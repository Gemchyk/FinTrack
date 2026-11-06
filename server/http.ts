import type { Response } from 'express';
import type { Me } from '../shared/api-types.ts';

export interface AuthUser extends Me {
  id: string;
}

// Returns void so handlers can `return fail(...)`: Express 5 types do not allow returning the Response
export function fail(res: Response, status: number, error: string): void {
  res.status(status).json({ error });
}

// Set by requireAuth in auth.ts
export function currentUser(res: Response): AuthUser {
  return res.locals.user as AuthUser;
}

export function asRecord(body: unknown): Record<string, unknown> {
  return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
}
