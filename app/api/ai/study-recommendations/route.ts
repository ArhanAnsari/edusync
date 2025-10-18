/**
 * AI Study Recommendations API Route
 * Provides personalized study recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStudyRecommendations } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      {
        error: 'Failed to generate study recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
