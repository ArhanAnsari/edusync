import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account, databases, config } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const SLACK_API_URL = 'https://slack.com/api';

// Slack notification integration endpoint
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const role = user.labels?.[0];
    const body = await request.json();
    const { action, botToken, channel, message, type, assignmentId, quizId, studentId, blocks } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    switch (action) {
      case 'send_message': {
        if (!message && !blocks) {
          return NextResponse.json({ error: 'Message or blocks are required' }, { status: 400 });
        }

        if (!botToken) {
          // Store notification in database for manual sending
          const notification = await databases.createDocument(
            config.databaseId,
            config.collections.notifications || 'notifications',
            ID.unique(),
            {
              userId: user.$id,
              type: 'slack',
              channel: channel || 'general',
              message,
              status: 'pending',
              createdAt: new Date().toISOString(),
            }
          );

          return NextResponse.json({
            success: true,
            manual: true,
            notification,
            message: 'Notification stored. Configure Slack Bot Token to send automatically.',
          }, { status: 201 });
        }

        // Send message using Slack API
        const payload: any = {
          channel: channel || 'general',
          text: message,
        };

        if (blocks) {
          payload.blocks = blocks;
        }

        const response = await fetch(`${SLACK_API_URL}/chat.postMessage`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!data.ok) {
          throw new Error(data.error || 'Failed to send Slack message');
        }

        // Store sent notification
        const notification = await databases.createDocument(
          config.databaseId,
          config.collections.notifications || 'notifications',
          ID.unique(),
          {
            userId: user.$id,
            type: 'slack',
            channel: channel || 'general',
            message,
            slackTs: data.ts,
            status: 'sent',
            createdAt: new Date().toISOString(),
          }
        );

        return NextResponse.json({
          success: true,
          notification: {
            id: notification.$id,
            channel: data.channel,
            timestamp: data.ts,
          },
          message: 'Message sent successfully to Slack',
        }, { status: 201 });
      }

      case 'notify_assignment': {
        if (!assignmentId) {
          return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
        }

        // Fetch assignment
        const assignment = await databases.getDocument(
          config.databaseId,
          config.collections.assignments,
          assignmentId
        );

        const messageText = `📚 *New Assignment Posted*\n\n*Title:* ${assignment.title}\n*Due Date:* ${new Date(assignment.dueDate).toLocaleDateString()}\n*Description:* ${assignment.description || 'No description'}\n\nPlease check your EduSync dashboard for more details.`;

        return POST(new Request(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify({
            action: 'send_message',
            botToken,
            channel,
            message: messageText,
          }),
        }));
      }

      case 'notify_quiz': {
        if (!quizId) {
          return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
        }

        // Fetch quiz
        const quiz = await databases.getDocument(
          config.databaseId,
          config.collections.quizzes,
          quizId
        );

        const messageText = `📝 *New Quiz Available*\n\n*Title:* ${quiz.title}\n*Time Limit:* ${quiz.timeLimit} minutes\n*Description:* ${quiz.description || 'No description'}\n\nLog in to EduSync to take the quiz!`;

        return POST(new Request(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify({
            action: 'send_message',
            botToken,
            channel,
            message: messageText,
          }),
        }));
      }

      case 'notify_grade': {
        if (!studentId || !assignmentId) {
          return NextResponse.json({ error: 'Student ID and Assignment ID are required' }, { status: 400 });
        }

        // Fetch student and assignment
        const [student, assignment, submission] = await Promise.all([
          databases.getDocument(config.databaseId, config.collections.users, studentId),
          databases.getDocument(config.databaseId, config.collections.assignments, assignmentId),
          databases.listDocuments(
            config.databaseId,
            config.collections.submissions,
            [
              Query.equal('userId', studentId),
              Query.equal('assignmentId', assignmentId),
            ]
          ),
        ]);

        const grade = submission.documents[0]?.grade || 'N/A';
        const feedback = submission.documents[0]?.feedback || 'No feedback';

        const messageText = `✅ *Assignment Graded*\n\n*Student:* ${student.name}\n*Assignment:* ${assignment.title}\n*Grade:* ${grade}\n*Feedback:* ${feedback}`;

        return POST(new Request(request.url, {
          method: 'POST',
          headers: request.headers,
          body: JSON.stringify({
            action: 'send_message',
            botToken,
            channel,
            message: messageText,
          }),
        }));
      }

      case 'list_channels': {
        if (!botToken) {
          return NextResponse.json({ error: 'Bot token is required' }, { status: 400 });
        }

        const response = await fetch(`${SLACK_API_URL}/conversations.list?types=public_channel,private_channel`, {
          headers: {
            'Authorization': `Bearer ${botToken}`,
          },
        });

        const data = await response.json();

        if (!data.ok) {
          throw new Error(data.error || 'Failed to list Slack channels');
        }

        return NextResponse.json({
          success: true,
          channels: data.channels.map((channel: any) => ({
            id: channel.id,
            name: channel.name,
            isPrivate: channel.is_private,
            memberCount: channel.num_members,
          })),
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Slack API Error:', error);
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

    if (action === 'notifications') {
      // Fetch stored notifications
      const notifications = await databases.listDocuments(
        config.databaseId,
        config.collections.notifications || 'notifications',
        [
          Query.equal('userId', user.$id),
          Query.equal('type', 'slack'),
        ]
      );

      return NextResponse.json({
        success: true,
        notifications: notifications.documents,
      });
    }

    return NextResponse.json({
      success: true,
      status: 'ready',
      message: 'Slack integration ready. Use POST with actions: send_message, notify_assignment, notify_quiz, notify_grade, list_channels',
    });
  } catch (error: any) {
    console.error('Slack API Error:', error);
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
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await databases.deleteDocument(
      config.databaseId,
      config.collections.notifications || 'notifications',
      notificationId
    );

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error: any) {
    console.error('Slack API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
