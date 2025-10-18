/**
 * AI Assignment Helper API Route
 * Generates assignment suggestions based on topic
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAssignmentSuggestions } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { topic, studentLevel, numberOfSuggestions } = await req.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required and must be a string' },
        { status: 400 }
      );
    }

    if (topic.trim().length < 3) {
      return NextResponse.json(
        { error: 'Topic must be at least 3 characters long' },
        { status: 400 }
      );
    }

    const validLevels = ['beginner', 'intermediate', 'advanced'];
    const level = studentLevel || 'intermediate';
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: 'Student level must be beginner, intermediate, or advanced' },
        { status: 400 }
      );
    }

    const numSuggestions = numberOfSuggestions || 3;
    if (numSuggestions < 1 || numSuggestions > 10) {
      return NextResponse.json(
        { error: 'Number of suggestions must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Generate assignment suggestions
    const suggestions = await generateAssignmentSuggestions(
      topic,
      level,
      numSuggestions
    );

    return NextResponse.json({
      success: true,
      topic,
      studentLevel: level,
      numberOfSuggestions: suggestions.length,
      suggestions,
    });
  } catch (error) {
    console.error('Assignment generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate assignment suggestions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
