/**
 * AI Content Summarizer API Route
 * Summarizes educational content
 */

import { NextRequest, NextResponse } from 'next/server';
import { summarizeContent } from '@/lib/ai';

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

    const { content, contentType } = await req.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.trim().length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters long to summarize' },
        { status: 400 }
      );
    }

    const validTypes = ['article', 'video-transcript', 'lecture-notes', 'textbook'];
    const type = contentType || 'article';
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: 'Content type must be article, video-transcript, lecture-notes, or textbook',
        },
        { status: 400 }
      );
    }

    // Generate summary
    const summary = await summarizeContent(content, type);

    return NextResponse.json({
      success: true,
      contentType: type,
      contentLength: content.length,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Content summarization error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let userMessage = 'Failed to summarize content';

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
