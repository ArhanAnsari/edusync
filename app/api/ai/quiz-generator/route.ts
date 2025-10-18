/**
 * AI Quiz Generator API Route
 * Generates quiz questions using AI based on topic
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateQuizQuestions } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { topic, numberOfQuestions, difficulty } = await req.json();

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

    const numQuestions = numberOfQuestions || 5;
    if (numQuestions < 1 || numQuestions > 20) {
      return NextResponse.json(
        { error: 'Number of questions must be between 1 and 20' },
        { status: 400 }
      );
    }

    const validDifficulties = ['easy', 'medium', 'hard'];
    const questionDifficulty = difficulty || 'medium';
    if (!validDifficulties.includes(questionDifficulty)) {
      return NextResponse.json(
        { error: 'Difficulty must be easy, medium, or hard' },
        { status: 400 }
      );
    }

    // Generate quiz questions
    const questions = await generateQuizQuestions(
      topic,
      numQuestions,
      questionDifficulty
    );

    return NextResponse.json({
      success: true,
      topic,
      numberOfQuestions: questions.length,
      difficulty: questionDifficulty,
      questions,
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate quiz questions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
