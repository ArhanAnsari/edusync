/**
 * AI Question Answering API Route
 * Answers student questions with context
 */

import { NextRequest, NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/ai';

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

    const { question, context, previousMessages } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    if (question.trim().length < 3) {
      return NextResponse.json(
        { error: 'Question must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Validate previousMessages if provided
    if (previousMessages) {
      if (!Array.isArray(previousMessages)) {
        return NextResponse.json(
          { error: 'previousMessages must be an array if provided' },
          { status: 400 }
        );
      }

      for (const msg of previousMessages) {
        if (!msg.role || !msg.content) {
          return NextResponse.json(
            { error: 'Each message in previousMessages must have role and content' },
            { status: 400 }
          );
        }
      }
    }

    // Generate answer
    const answer = await answerQuestion(question, context, previousMessages);

    return NextResponse.json({
      success: true,
      question,
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Question answering error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let userMessage = 'Failed to answer question';

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
