import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) return null;

  return verifyToken(token);
}

import { JWTPayload } from './auth';

export async function withAuth(handler: (payload: JWTPayload) => Promise<Response>) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return handler(session);
}
