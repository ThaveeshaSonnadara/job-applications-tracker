import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export function hashAdminToken(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function isAdminRequest(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return false;
  }

  const token = request.cookies.get('admin_token')?.value;
  if (!token) {
    return false;
  }

  const expectedToken = hashAdminToken(adminPassword);
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expectedToken);

  return (
    tokenBuf.length === expectedBuf.length &&
    crypto.timingSafeEqual(tokenBuf, expectedBuf)
  );
}

export function requireAdmin(request: NextRequest): NextResponse | null {
  if (isAdminRequest(request)) {
    return null;
  }

  return NextResponse.json(
    { error: 'Unauthorized: Admin access required' },
    { status: 401 }
  );
}

