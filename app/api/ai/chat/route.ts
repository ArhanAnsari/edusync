/**
 * AI Chat API Route
 * Handles real-time chat with AI assistant using streaming
 */

import { NextRequest } from 'next/server';
import { chatWithAssistant } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
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
    }

    // Get streaming response from AI
    const result = await chatWithAssistant(messages, context);

    // Stream the response back to the client
    return result;
  } catch (error) {
    console.error('AI chat error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
