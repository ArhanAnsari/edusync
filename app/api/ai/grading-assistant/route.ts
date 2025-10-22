/**
 * AI Grading Assistant API Route
 * Provides grading feedback and suggestions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getGradingFeedback } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    // Check API key is configured
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          error: 'AI service not configured',
          details: 'Missing required API key. Please contact administrator.'
        },
        { status: 503 }
      );
    }

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
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let userMessage = 'Failed to generate grading feedback';

    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      statusCode = 503;
      userMessage = 'AI service authentication failed';
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      statusCode = 429;
      userMessage = 'AI service rate limited. Please try again later.';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      statusCode = 504;
      userMessage = 'AI service timeout. Please try again.';
    } else if (errorMessage.includes('not configured')) {
      statusCode = 503;
      userMessage = errorMessage;
    }

    return NextResponse.json(
      {
        error: userMessage,
        details: errorMessage,
      },
      { status: statusCode }
    );
  }
}
