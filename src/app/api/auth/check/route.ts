import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';

// GET /api/auth/check — Check if current user is admin
export async function GET(request: NextRequest) {
  return NextResponse.json({
    isAdmin: isAdminRequest(request),
  });
}
