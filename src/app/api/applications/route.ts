import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isAdminRequest, requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const search = searchParams.get('search');
    const isAdmin = isAdminRequest(request);

    const where: Record<string, unknown> = {};
    if (status && status !== 'ALL') where.status = status;
    if (source && source !== 'ALL') where.applicationSource = source;
    if (search) {
      where.OR = [
        { companyName: { contains: search } },
        { jobTitle: { contains: search } },
      ];
    }

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(isAdmin
        ? {
            include: {
              _count: {
                select: {
                  generatedAnswers: true,
                  interviewQuestions: true,
                },
              },
            },
          }
        : {}),
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {

    const body = await request.json();
    
    const application = await prisma.application.create({
      data: {
        companyName: body.companyName,
        jobTitle: body.jobTitle,
        jobUrl: body.jobUrl || null,
        jobDescription: body.jobDescription || null,
        companyBackground: body.companyBackground || null,
        applicationSource: body.applicationSource || 'OTHER',
        status: body.status || 'SAVED',
        applicationDate: body.applicationDate ? new Date(body.applicationDate) : null,
        salary: body.salary || null,
        location: body.location || null,
        workMode: body.workMode || 'ONSITE',
        notes: body.notes || null,
        requiredTechnologies: body.requiredTechnologies || '',
        contactPerson: body.contactPerson || null,
        contactEmail: body.contactEmail || null,
        contactPhone: body.contactPhone || null,
        documentsAttached: body.documentsAttached || '',
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

