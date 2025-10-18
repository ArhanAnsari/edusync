/**
 * AI Content Summarizer API Route
 * Summarizes educational content
 */

import { NextRequest, NextResponse } from 'next/server';
import { summarizeContent } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      {
        error: 'Failed to summarize content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
