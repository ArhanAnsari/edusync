/**
 * AI Chat API Route
 * Handles real-time chat with AI assistant using streaming
 */

import { NextRequest } from 'next/server';
import { chatWithAssistant } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Check API key is configured
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'AI service not configured',
          details: 'Missing required API key. Please contact administrator.'
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array must not be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate messages format
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        return new Response(
          JSON.stringify({ error: 'Each message must have role and content' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (!['user', 'assistant'].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: 'Message role must be "user" or "assistant"' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Message content must be a non-empty string' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get streaming response from AI
    const result = await chatWithAssistant(messages, context);

    // Return the streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI chat error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let statusCode = 500;
    let userMessage = 'Failed to process chat message';

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
      userMessage = 'Content blocked by AI safety filters. Please modify your request.';
    } else if (errorMessage.includes('thinking') || errorMessage.includes('budget')) {
      statusCode = 413;
      userMessage = 'Request too complex. Please simplify your question.';
    } else if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      statusCode = 503;
      userMessage = 'AI model temporarily unavailable. System will try an alternative.';
    } else if (errorMessage.includes('GenerateContentRequest')) {
      statusCode = 400;
      userMessage = 'Invalid request format.';
    }

    return new Response(
      JSON.stringify({
        error: userMessage,
        details: errorMessage,
      }),
      { status: statusCode, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
