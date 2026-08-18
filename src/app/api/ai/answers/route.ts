import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateFormAnswers } from '@/lib/ai';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const { applicationId, questions } = body;

    if (!applicationId || !questions) {
      return NextResponse.json(
        { error: 'applicationId and questions are required' },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const answers = await generateFormAnswers(
      questions,
      application.jobDescription || '',
      application.companyName,
      application.companyBackground || '',
      application.jobTitle,
      application.requiredTechnologies || ''
    );

    // Save answers to database
    const savedAnswers = await Promise.all(
      answers.map(async (qa) => {
        return prisma.generatedAnswer.create({
          data: {
            applicationId,
            question: qa.question,
            answer: qa.answer,
          },
        });
      })
    );

    return NextResponse.json(savedAnswers);
  } catch (error) {
    console.error('Error generating answers:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate answers';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
