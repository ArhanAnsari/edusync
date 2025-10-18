/**
 * AI Grading Assistant API Route
 * Provides grading feedback and suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGradingFeedback } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { assignmentPrompt, studentSubmission, rubric } = await req.json();

    if (!assignmentPrompt || typeof assignmentPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Assignment prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!studentSubmission || typeof studentSubmission !== 'string') {
      return NextResponse.json(
        { error: 'Student submission is required and must be a string' },
        { status: 400 }
      );
    }

    if (assignmentPrompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Assignment prompt must be at least 10 characters long' },
        { status: 400 }
      );
    }

    if (studentSubmission.trim().length < 10) {
      return NextResponse.json(
        { error: 'Student submission must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Generate grading feedback
    const feedback = await getGradingFeedback(
      assignmentPrompt,
      studentSubmission,
      rubric
    );

    return NextResponse.json({
      success: true,
      feedback,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Grading assistant error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate grading feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
