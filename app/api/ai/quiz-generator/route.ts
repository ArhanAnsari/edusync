/**
 * AI Quiz Generator API Route
 * Generates quiz questions using AI based on topic
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateQuizQuestions } from '@/lib/ai';

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
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let userMessage = 'Failed to generate quiz questions';

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
    } else if (errorMessage.includes('safety') || errorMessage.includes('block') || errorMessage.includes('harmful')) {
      statusCode = 400;
      userMessage = 'Content blocked by AI safety filters. Please modify your topic.';
    } else if (errorMessage.includes('schema') || errorMessage.includes('properties')) {
      statusCode = 500;
      userMessage = 'AI had trouble formatting quiz questions. Please try a different topic.';
    } else if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      statusCode = 503;
      userMessage = 'AI model temporarily unavailable. System will try an alternative.';
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
