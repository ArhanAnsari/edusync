/**
 * app/api/ai/chat/route.ts
 * Edge route for streaming AI chat responses
 */

import { NextRequest } from 'next/server';
import { chatWithAssistant, isAIConfigured } from '@/lib/ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    if (!isAIConfigured()) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured', details: 'Missing API key.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
    }

    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
    }
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array must not be empty' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
    }

    // Validate messages shape
    for (const m of messages) {
      if (!m || !m.role || !m.content) {
        return new Response(JSON.stringify({ error: 'Each message must have role and content' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
      }
      if (!['user', 'assistant'].includes(m.role)) {
        return new Response(JSON.stringify({ error: 'Message role must be "user" or "assistant"' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
      }
      if (typeof m.content !== 'string' || m.content.trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Message content must be a non-empty string' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
      }
    }

    // Request streaming result
    const streamResult = await chatWithAssistant(messages, context);

    // Common SDK shape: has method toTextStreamResponse()
    if (streamResult && typeof (streamResult as any).toTextStreamResponse === 'function') {
      return (streamResult as any).toTextStreamResponse();
    }

    // Fallback: if a readable stream is available
    if (streamResult && (streamResult as any).stream) {
      return new Response((streamResult as any).stream, {
        headers: { 'Content-Type': 'text/event-stream' },
        status: 200,
      });
    }

    // Another possible shape: body / readable
    if (streamResult && (streamResult as any).body) {
      return new Response((streamResult as any).body, {
        headers: { 'Content-Type': 'text/event-stream' },
        status: 200,
      });
    }

    // Last fallback: error
    return new Response(JSON.stringify({ error: 'AI service returned unsupported streaming shape' }), { status: 502, headers: { 'Content-Type': 'application/json' }});
  } catch (error: any) {
    console.error('AI chat error:', error);
    const errMsg = error?.message || String(error || 'Unknown error');
    let statusCode = 500;
    let userMessage = 'Failed to process chat message';

    if (errMsg.includes('API key') || errMsg.includes('401')) {
      statusCode = 503;
      userMessage = 'AI service authentication failed';
    } else if (errMsg.includes('rate limit') || errMsg.includes('429')) {
      statusCode = 429;
      userMessage = 'AI service rate limited. Please try again later.';
    } else if (errMsg.includes('timeout') || errMsg.includes('DEADLINE_EXCEEDED')) {
      statusCode = 504;
      userMessage = 'AI service timeout. Please try again.';
    } else if (errMsg.includes('safety') || errMsg.includes('block') || errMsg.includes('harmful')) {
      statusCode = 400;
      userMessage = 'Content blocked by AI safety filters. Please modify your request.';
    } else if (errMsg.includes('thinking') || errMsg.includes('budget')) {
      statusCode = 413;
      userMessage = 'Request too complex. Please simplify your question.';
    } else if (errMsg.includes('model') || errMsg.includes('not available')) {
      statusCode = 503;
      userMessage = 'AI model temporarily unavailable.';
    } else if (errMsg.includes('GenerateContentRequest')) {
      statusCode = 400;
      userMessage = 'Invalid request format.';
    }

    return new Response(JSON.stringify({ error: userMessage, details: errMsg }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
