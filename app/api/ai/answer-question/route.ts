/**
 * AI Question Answering API Route
 * Answers student questions with context
 */

import { NextRequest, NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      {
        error: 'Failed to answer question',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
