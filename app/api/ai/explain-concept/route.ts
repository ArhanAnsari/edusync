/**
 * AI Concept Explainer API Route
 * Explains concepts in different detail levels
 */

import { NextRequest, NextResponse } from 'next/server';
import { explainConcept } from '@/lib/ai';

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

    const { concept, context, level } = await req.json();

    if (!concept || typeof concept !== 'string') {
      return NextResponse.json(
        { error: 'Concept is required and must be a string' },
        { status: 400 }
      );
    }

    if (concept.trim().length < 2) {
      return NextResponse.json(
        { error: 'Concept must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const validLevels = ['simple', 'detailed', 'advanced'];
    const explanationLevel = level || 'detailed';
    if (!validLevels.includes(explanationLevel)) {
      return NextResponse.json(
        { error: 'Level must be simple, detailed, or advanced' },
        { status: 400 }
      );
    }

    // Generate explanation
    const explanation = await explainConcept(
      concept,
      context,
      explanationLevel
    );

    return NextResponse.json({
      success: true,
      concept,
      level: explanationLevel,
      context,
      explanation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Concept explanation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let userMessage = 'Failed to explain concept';

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
