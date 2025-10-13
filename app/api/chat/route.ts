import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for chat messages (for demo - use database in production)
const chatSessions = new Map<string, Array<{ text: string; sender: 'user' | 'support'; timestamp: number }>>();

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userEmail } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and session ID are required' },
        { status: 400 }
      );
    }

    // Get or create chat session
    if (!chatSessions.has(sessionId)) {
      chatSessions.set(sessionId, []);
    }

    const session = chatSessions.get(sessionId)!;

    // Add user message
    session.push({
      text: message,
      sender: 'user',
      timestamp: Date.now()
    });

    // Auto-response logic (you can make this smarter or connect to actual support)
    let autoResponse = '';

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      autoResponse = 'Our support team is here to help! For immediate assistance, email us at arhanansari2009@gmail.com';
    } else if (lowerMessage.includes('quiz') || lowerMessage.includes('assignment')) {
      autoResponse = 'For questions about quizzes or assignments, please check the Help section in your dashboard or contact your teacher.';
    } else if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
      autoResponse = 'Having trouble logging in? Try resetting your password from the login page. If issues persist, contact support at arhanansari2009@gmail.com';
    } else if (lowerMessage.includes('thank')) {
      autoResponse = 'You\'re welcome! Feel free to reach out anytime. 😊';
    } else {
      autoResponse = 'Thanks for your message! Our team will get back to you shortly. For urgent matters, email arhanansari2009@gmail.com';
    }

    // Add auto-response
    session.push({
      text: autoResponse,
      sender: 'support',
      timestamp: Date.now()
    });

    // Optional: Send notification email to admin
    // You can integrate Resend here if needed

    return NextResponse.json({
      success: true,
      response: autoResponse,
      timestamp: Date.now()
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID is required' },
      { status: 400 }
    );
  }

  const session = chatSessions.get(sessionId) || [];

  return NextResponse.json({
    messages: session
  });
}
