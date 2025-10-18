import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account, databases, config } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const ZOOM_API_URL = 'https://api.zoom.us/v2';

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
    const { 
      action, 
      accessToken, 
      topic, 
      duration, 
      startTime, 
      agenda, 
      timezone,
      password,
      waitingRoom,
      assignmentId,
      quizId,
      type,
    } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    switch (action) {
      case 'create_meeting': {
        if (!topic) {
          return NextResponse.json({ error: 'Meeting topic is required' }, { status: 400 });
        }

        if (!accessToken) {
          // Store meeting intent in database for manual creation
          const meetingIntent = await databases.createDocument(
            config.databaseId,
            config.collections.meetings || 'meetings',
            ID.unique(),
            {
              userId: user.$id,
              topic,
              agenda: agenda || '',
              duration: duration || 60,
              startTime: startTime || new Date().toISOString(),
              status: 'pending',
              type: 'zoom',
              createdAt: new Date().toISOString(),
            }
          );

          return NextResponse.json({
            success: true,
            manual: true,
            meeting: meetingIntent,
            message: 'Meeting intent stored. Configure Zoom OAuth for automatic meeting creation.',
          }, { status: 201 });
        }

        // Create meeting using Zoom API
        const meetingData: any = {
          topic,
          type: type || 2, // 2 = Scheduled meeting
          start_time: startTime || new Date().toISOString(),
          duration: duration || 60,
          timezone: timezone || 'UTC',
          agenda: agenda || '',
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            watermark: false,
            waiting_room: waitingRoom !== undefined ? waitingRoom : true,
            audio: 'both',
            auto_recording: 'none',
            approval_type: 0,
          },
        };

        if (password) {
          meetingData.settings.meeting_authentication = true;
        }

        const response = await fetch(`${ZOOM_API_URL}/users/me/meetings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meetingData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create Zoom meeting');
        }

        const meeting = await response.json();

        // Store meeting in database
        const storedMeeting = await databases.createDocument(
          config.databaseId,
          config.collections.meetings || 'meetings',
          ID.unique(),
          {
            userId: user.$id,
            meetingId: meeting.id.toString(),
            topic: meeting.topic,
            agenda: meeting.agenda,
            duration: meeting.duration,
            startTime: meeting.start_time,
            joinUrl: meeting.join_url,
            password: meeting.password,
            hostEmail: user.email,
            status: 'scheduled',
            type: 'zoom',
            assignmentId: assignmentId || null,
            quizId: quizId || null,
            createdAt: new Date().toISOString(),
          }
        );

        return NextResponse.json({
          success: true,
          meeting: {
            id: meeting.id,
            topic: meeting.topic,
            joinUrl: meeting.join_url,
            password: meeting.password,
            startTime: meeting.start_time,
            duration: meeting.duration,
            hostEmail: user.email,
          },
          message: 'Meeting created successfully',
        }, { status: 201 });
      }

      case 'create_instant_meeting': {
        if (!accessToken) {
          return NextResponse.json({ error: 'Access token is required for instant meetings' }, { status: 400 });
        }

        const meetingData = {
          topic: topic || 'EduSync Instant Meeting',
          type: 1, // Instant meeting
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            mute_upon_entry: true,
            waiting_room: false,
            audio: 'both',
          },
        };

        const response = await fetch(`${ZOOM_API_URL}/users/me/meetings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meetingData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create instant meeting');
        }

        const meeting = await response.json();

        return NextResponse.json({
          success: true,
          meeting: {
            id: meeting.id,
            topic: meeting.topic,
            joinUrl: meeting.join_url,
            password: meeting.password,
          },
          message: 'Instant meeting created successfully',
        }, { status: 201 });
      }

      case 'update_meeting': {
        if (!accessToken) {
          return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
        }

        const { meetingId, updates } = body;
        if (!meetingId) {
          return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
        }

        const response = await fetch(`${ZOOM_API_URL}/meetings/${meetingId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to update meeting');
        }

        return NextResponse.json({
          success: true,
          message: 'Meeting updated successfully',
        });
      }

      case 'get_meeting_details': {
        if (!accessToken) {
          return NextResponse.json({ error: 'Access token is required' }, { status: 400 });
        }

        const { meetingId } = body;
        if (!meetingId) {
          return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
        }

        const response = await fetch(`${ZOOM_API_URL}/meetings/${meetingId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meeting details');
        }

        const meeting = await response.json();

        return NextResponse.json({
          success: true,
          meeting: {
            id: meeting.id,
            topic: meeting.topic,
            agenda: meeting.agenda,
            startTime: meeting.start_time,
            duration: meeting.duration,
            joinUrl: meeting.join_url,
            password: meeting.password,
            status: meeting.status,
          },
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Zoom API Error:', error);
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
    const accessToken = searchParams.get('accessToken');

    if (action === 'list_meetings') {
      if (!accessToken) {
        // Fetch from local database
        const meetings = await databases.listDocuments(
          config.databaseId,
          config.collections.meetings || 'meetings',
          [
            Query.equal('userId', user.$id),
            Query.equal('type', 'zoom'),
          ]
        );

        return NextResponse.json({
          success: true,
          local: true,
          meetings: meetings.documents,
          message: 'Showing locally stored meetings. Configure Zoom OAuth to sync with Zoom.',
        });
      }

      // Fetch from Zoom API
      const response = await fetch(`${ZOOM_API_URL}/users/me/meetings?type=scheduled&page_size=30`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meetings from Zoom');
      }

      const data = await response.json();

      return NextResponse.json({
        success: true,
        meetings: data.meetings.map((meeting: any) => ({
          id: meeting.id,
          topic: meeting.topic,
          startTime: meeting.start_time,
          duration: meeting.duration,
          joinUrl: meeting.join_url,
          status: meeting.status,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      status: 'ready',
      message: 'Zoom integration ready. Use POST with actions: create_meeting, create_instant_meeting, update_meeting, get_meeting_details',
    });
  } catch (error: any) {
    console.error('Zoom API Error:', error);
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

    const user = await account.get();
    const role = user.labels?.[0];

    if (role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can delete meetings' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('id');
    const accessToken = searchParams.get('accessToken');

    if (!meetingId) {
      return NextResponse.json({ error: 'Meeting ID is required' }, { status: 400 });
    }

    if (accessToken) {
      // Delete from Zoom
      const response = await fetch(`${ZOOM_API_URL}/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('Failed to delete meeting from Zoom');
      }
    }

    // Delete from local database
    const meetings = await databases.listDocuments(
      config.databaseId,
      config.collections.meetings || 'meetings',
      [Query.equal('meetingId', meetingId)]
    );

    if (meetings.documents.length > 0) {
      await databases.deleteDocument(
        config.databaseId,
        config.collections.meetings || 'meetings',
        meetings.documents[0].$id
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Meeting deleted successfully',
    });
  } catch (error: any) {
    console.error('Zoom API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
