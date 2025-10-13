import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account } from '@/lib/appwrite';

// Google Calendar integration endpoint
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const body = await request.json();
    const { eventTitle, eventDescription, startTime, endTime } = body;

    if (!eventTitle || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Event title, start time, and end time are required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual Google Calendar API integration
    // For now, return a placeholder response
    const event = {
      id: `event_${Date.now()}`,
      title: eventTitle,
      description: eventDescription,
      start: startTime,
      end: endTime,
      calendarLink: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(eventDescription || '')}`,
      status: 'created',
      message: 'Event created successfully. Click the calendar link to add to Google Calendar.',
    };

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Google Calendar API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch events from Google Calendar
    return NextResponse.json({
      events: [],
      message: 'Google Calendar integration ready. Configure OAuth to sync events.',
    });
  } catch (error) {
    console.error('Google Calendar API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
