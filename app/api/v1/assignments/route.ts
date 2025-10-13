import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { databases, config, account } from '@/lib/appwrite';
import { Query } from 'appwrite';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const role = user.labels?.[0] || 'student';

    // Get submissions based on role
    const queries = role === 'student'
      ? [Query.equal('userId', user.$id)]
      : [Query.equal('teacherId', user.$id)];

    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.submissions,
      queries
    );

    return NextResponse.json({
      assignments: response.documents,
      total: response.total,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const body = await request.json();
    const { assignmentId, content, fileUrl } = body;

    if (!assignmentId || !content) {
      return NextResponse.json({ error: 'Assignment ID and content required' }, { status: 400 });
    }

    const submission = await databases.createDocument(
      config.databaseId,
      config.collections.submissions,
      'unique()',
      {
        assignmentId,
        userId: user.$id,
        userName: user.name,
        userEmail: user.email,
        content,
        fileUrl: fileUrl || '',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        grade: 0,
      }
    );

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
