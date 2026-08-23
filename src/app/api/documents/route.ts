import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/documents — Public: fetch all documents
export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: [
        { isMandatoryAlways: 'desc' },
        { category: 'asc' },
        { createdAt: 'asc' },
      ],
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /api/documents — Admin only: upload a new document
export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();

    const fileEntry = formData.get('file');
    const title = formData.get('title') as string | null;
    const category = formData.get('category') as string | null;
    const description = formData.get('description') as string | null;
    const usageGuidance = formData.get('usageGuidance') as string | null;
    const isMandatoryAlways = formData.get('isMandatoryAlways') === 'true';
    const isOnlyOnDemand = formData.get('isOnlyOnDemand') === 'true';

    if (!fileEntry || typeof fileEntry === 'string' || !title || !category || !description || !usageGuidance) {
      return NextResponse.json(
        { error: 'Missing required fields: valid file, title, category, description, usageGuidance' },
        { status: 400 }
      );
    }

    const file = fileEntry as File;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Determine file type from extension
    const ext = path.extname(file.name).toLowerCase().replace('.', '');
    const allowedTypes = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'];
    if (!allowedTypes.includes(ext)) {
      return NextResponse.json(
        { error: `File type .${ext} not allowed. Allowed: ${allowedTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Ensure public/documents directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'documents');
    await mkdir(uploadDir, { recursive: true });

    // Save file to public/documents/
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    // Format file size
    const sizeKB = Math.round(file.size / 1024);
    const fileSize = sizeKB >= 1024
      ? `${(sizeKB / 1024).toFixed(1)} MB`
      : `${sizeKB} KB`;

    // Create database record
    const document = await prisma.document.create({
      data: {
        title,
        filename: file.name,
        fileSize,
        fileType: ext,
        category,
        description,
        usageGuidance,
        isMandatoryAlways,
        isOnlyOnDemand,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to upload document:', error);
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'A document with this filename already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}
