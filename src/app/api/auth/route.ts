import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { hashAdminToken } from '@/lib/admin-auth';

// POST /api/auth — Login
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 500 });
    }

    const passwordStr = typeof password === 'string' ? password : '';
    const passwordBuf = Buffer.from(passwordStr);
    const adminBuf = Buffer.from(adminPassword);
    const isValid =
      passwordBuf.length === adminBuf.length && crypto.timingSafeEqual(passwordBuf, adminBuf);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = hashAdminToken(adminPassword);
    const response = NextResponse.json({ success: true });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE /api/auth — Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  return response;
}
