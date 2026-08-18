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
  return token === hashAdminToken(adminPassword);
}

export function requireAdmin(request: NextRequest): NextResponse | null {
  if (isAdminRequest(request)) {
    return null;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
