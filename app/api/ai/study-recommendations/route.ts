/**
 * AI Study Recommendations API Route
 * Provides personalized study recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStudyRecommendations } from '@/lib/ai';

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

    const {
      currentTopics,
      strugglingWith,
      interests,
      upcomingTests,
    } = await req.json();

    if (!currentTopics || !Array.isArray(currentTopics) || currentTopics.length === 0) {
      return NextResponse.json(
        { error: 'currentTopics is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate all array inputs
    if (strugglingWith && !Array.isArray(strugglingWith)) {
      return NextResponse.json(
        { error: 'strugglingWith must be an array if provided' },
        { status: 400 }
      );
    }

    if (interests && !Array.isArray(interests)) {
      return NextResponse.json(
        { error: 'interests must be an array if provided' },
        { status: 400 }
      );
    }

    if (upcomingTests && !Array.isArray(upcomingTests)) {
      return NextResponse.json(
        { error: 'upcomingTests must be an array if provided' },
        { status: 400 }
      );
    }

    // Generate study recommendations
    const recommendations = await getStudyRecommendations({
      currentTopics,
      strugglingWith,
      interests,
      upcomingTests,
    });

    return NextResponse.json({
      success: true,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Study recommendations error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let userMessage = 'Failed to generate study recommendations';

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
