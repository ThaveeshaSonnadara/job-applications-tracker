import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInterviewPrep } from '@/lib/ai';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId is required' },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const questions = await generateInterviewPrep(
      application.jobDescription || '',
      application.companyName,
      application.companyBackground || '',
      application.jobTitle,
      application.requiredTechnologies || ''
    );

    // Save questions to database
    const savedQuestions = await Promise.all(
      questions.map(async (q) => {
        return prisma.interviewQuestion.create({
          data: {
            applicationId,
            question: q.question,
            suggestedAnswer: q.suggestedAnswer,
            category: q.category,
            difficulty: q.difficulty,
          },
        });
      })
    );

    return NextResponse.json(savedQuestions);
  } catch (error) {
    console.error('Error generating interview prep:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate interview prep';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
