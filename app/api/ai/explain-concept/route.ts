/**
 * AI Concept Explainer API Route
 * Explains concepts in different detail levels
 */

import { NextRequest, NextResponse } from 'next/server';
import { explainConcept } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      {
        error: 'Failed to explain concept',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
