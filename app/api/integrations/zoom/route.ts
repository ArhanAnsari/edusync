import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account } from '@/lib/appwrite';

// Zoom meeting integration endpoint
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const role = user.labels?.[0];

    if (role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create meetings' }, { status: 403 });
    }

    const body = await request.json();
    const { topic, duration, startTime, agenda } = body;

    if (!topic) {
      return NextResponse.json({ error: 'Meeting topic is required' }, { status: 400 });
    }

    // TODO: Implement actual Zoom API integration
    // For now, return a placeholder meeting
    const meeting = {
      id: `meeting_${Date.now()}`,
      topic,
      agenda: agenda || '',
      duration: duration || 60,
      startTime: startTime || new Date().toISOString(),
      joinUrl: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
      password: Math.random().toString(36).substring(7).toUpperCase(),
      hostEmail: user.email,
      status: 'scheduled',
      message: 'Meeting created successfully. Configure Zoom API for actual meetings.',
    };

    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error('Zoom API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch meetings from Zoom
    return NextResponse.json({
      meetings: [],
      message: 'Zoom integration ready. Configure Zoom OAuth to list meetings.',
    });
  } catch (error) {
    console.error('Zoom API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
