import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account, databases, config } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

// Google Calendar integration endpoint
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const role = user.labels?.[0];
    const body = await request.json();
    const { action, accessToken, eventTitle, eventDescription, startTime, endTime, attendees, assignmentId, quizId } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    switch (action) {
      case 'create_event': {
        if (!eventTitle || !startTime || !endTime) {
          return NextResponse.json(
            { error: 'Event title, start time, and end time are required' },
            { status: 400 }
          );
        }

        if (!accessToken) {
          // Return calendar link for manual adding
          const startTimeFormatted = new Date(startTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          const endTimeFormatted = new Date(endTime).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
          
          const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startTimeFormatted}/${endTimeFormatted}&details=${encodeURIComponent(eventDescription || '')}&sf=true`;

          return NextResponse.json({
            success: true,
            manual: true,
            calendarLink,
            message: 'Calendar link generated. Configure Google OAuth for automatic event creation.',
          }, { status: 201 });
        }

        // Create event using Google Calendar API
        const eventData = {
          summary: eventTitle,
          description: eventDescription || '',
          start: {
            dateTime: new Date(startTime).toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: new Date(endTime).toISOString(),
            timeZone: 'UTC',
          },
          attendees: attendees?.map((email: string) => ({ email })) || [],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 30 },
            ],
          },
        };

        const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to create calendar event');
        }

        const event = await response.json();

        // Store event in database
        const calendarEvent = await databases.createDocument(
          config.databaseId,
          config.collections.calendarEvents || 'calendar_events',
          ID.unique(),
          {
            userId: user.$id,
            eventId: event.id,
            title: eventTitle,
            description: eventDescription,
            startTime,
            endTime,
            googleEventLink: event.htmlLink,
            assignmentId: assignmentId || null,
            quizId: quizId || null,
            createdAt: new Date().toISOString(),
          }
        );

        return NextResponse.json({
          success: true,
          event: {
            id: event.id,
            title: eventTitle,
            link: event.htmlLink,
            startTime,
            endTime,
          },
          message: 'Event created successfully in Google Calendar',
        }, { status: 201 });
      }

      case 'list_events': {
        if (!accessToken) {
          return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
        }

        const timeMin = new Date().toISOString();
        const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Next 30 days

        const response = await fetch(
          `${GOOGLE_CALENDAR_API}/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch calendar events');
        }

        const data = await response.json();

        return NextResponse.json({
          success: true,
          events: data.items.map((event: any) => ({
            id: event.id,
            title: event.summary,
            description: event.description,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            link: event.htmlLink,
            attendees: event.attendees?.map((a: any) => a.email) || [],
          })),
        });
      }

      case 'sync_assignment': {
        if (!assignmentId) {
          return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
        }

        // Fetch assignment
        const assignment = await databases.getDocument(
          config.databaseId,
          config.collections.assignments,
          assignmentId
        );

        // Create calendar event for assignment deadline
        const eventData = {
          eventTitle: `Assignment Due: ${assignment.title}`,
          eventDescription: assignment.description || 'Complete your assignment before the deadline',
          startTime: new Date(assignment.dueDate).toISOString(),
          endTime: new Date(new Date(assignment.dueDate).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
          assignmentId,
          accessToken,
          action: 'create_event',
        };

        // Recursively call with create_event action
        return POST(new Request(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify(eventData),
        }));
      }

      case 'sync_quiz': {
        if (!quizId) {
          return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
        }

        // Fetch quiz
        const quiz = await databases.getDocument(
          config.databaseId,
          config.collections.quizzes,
          quizId
        );

        // Create calendar event for quiz
        const eventData = {
          eventTitle: `Quiz: ${quiz.title}`,
          eventDescription: quiz.description || 'Complete your quiz',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          quizId,
          accessToken,
          action: 'create_event',
        };

        return POST(new Request(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify(eventData),
        }));
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Google Calendar API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'synced_events') {
      // Fetch stored calendar events
      const events = await databases.listDocuments(
        config.databaseId,
        config.collections.calendarEvents || 'calendar_events',
        [Query.equal('userId', user.$id)]
      );

      return NextResponse.json({
        success: true,
        events: events.documents,
      });
    }

    return NextResponse.json({
      success: true,
      status: 'ready',
      message: 'Google Calendar integration ready. Use POST with actions: create_event, list_events, sync_assignment, sync_quiz',
    });
  } catch (error: any) {
    console.error('Google Calendar API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');
    const accessToken = searchParams.get('token');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    if (accessToken) {
      // Delete from Google Calendar
      const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to delete event from Google Calendar');
      }
    }

    // Delete from local database
    const events = await databases.listDocuments(
      config.databaseId,
      config.collections.calendarEvents || 'calendar_events',
      [Query.equal('eventId', eventId)]
    );

    if (events.documents.length > 0) {
      await databases.deleteDocument(
        config.databaseId,
        config.collections.calendarEvents || 'calendar_events',
        events.documents[0].$id
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    console.error('Google Calendar API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
