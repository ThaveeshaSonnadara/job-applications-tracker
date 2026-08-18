import { NextRequest, NextResponse } from 'next/server';
import { extractJobFromUrl } from '@/lib/ai';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: 'Only HTTP and HTTPS URLs are supported' },
        { status: 400 }
      );
    }

    // Extract job data
    const jobData = await extractJobFromUrl(url);

    return NextResponse.json(jobData);
  } catch (error) {
    console.error('Error extracting job from URL:', error);
    const message = error instanceof Error ? error.message : 'Failed to extract job details';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}