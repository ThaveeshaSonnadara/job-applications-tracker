import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { unlink } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// PUT /api/documents/[id] — Admin only: update document metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();

    const {
      title,
      category,
      description,
      usageGuidance,
      isMandatoryAlways,
      isOnlyOnDemand,
    } = body;

    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(usageGuidance !== undefined && { usageGuidance }),
        ...(isMandatoryAlways !== undefined && { isMandatoryAlways }),
        ...(isOnlyOnDemand !== undefined && { isOnlyOnDemand }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

// DELETE /api/documents/[id] — Admin only: delete document + file
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const existing = await prisma.document.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Delete the file from public/documents/
    try {
      const filePath = path.join(process.cwd(), 'public', 'documents', existing.filename);
      await unlink(filePath);
    } catch (fileErr) {
      // File may already be deleted or missing, continue with DB cleanup
      console.warn('File deletion warning:', fileErr);
    }

    // Delete the database record
    await prisma.document.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
