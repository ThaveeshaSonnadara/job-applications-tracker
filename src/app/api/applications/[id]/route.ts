import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        generatedAnswers: { orderBy: { createdAt: 'desc' } },
        interviewQuestions: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = {};
    
    const fields = [
      'companyName', 'jobTitle', 'jobUrl', 'jobDescription', 'companyBackground',
      'applicationSource', 'status', 'salary', 'location', 'workMode',
      'notes', 'requiredTechnologies', 'contactPerson', 'contactEmail',
      'contactPhone', 'documentsAttached'
    ];
    
    for (const field of fields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (body.applicationDate !== undefined) {
      updateData.applicationDate = body.applicationDate ? new Date(body.applicationDate) : null;
    }
    if (body.responseDate !== undefined) {
      updateData.responseDate = body.responseDate ? new Date(body.responseDate) : null;
    }

    // Auto-set application date when status changes to APPLIED
    if (body.status === 'APPLIED' && !body.applicationDate) {
      updateData.applicationDate = new Date();
    }

    // Auto-set response date when status changes to response statuses
    if (['INTERVIEW_CALLED', 'PHONE_CALL', 'EMAIL_RESPONSE', 'OFFERED', 'REJECTED'].includes(body.status)) {
      updateData.responseDate = new Date();
    }

    const application = await prisma.application.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
