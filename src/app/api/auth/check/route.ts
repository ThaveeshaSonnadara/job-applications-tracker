import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function hashToken(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// GET /api/auth/check — Check if current user is admin
export async function GET(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ isAdmin: false });
  }

  const token = request.cookies.get('admin_token')?.value;
  const expectedToken = hashToken(adminPassword);

  return NextResponse.json({
    isAdmin: token === expectedToken,
  });
}
