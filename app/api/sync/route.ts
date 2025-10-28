import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { getUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    // ✅ Move user check inside the POST handler
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate payload
    if (!body || !body.type || !body.data) {
      return NextResponse.json({ error: 'Invalid sync payload' }, { status: 400 });
    }

    const { type, data } = body;

    switch (type) {
      case 'quizAttempt': {
        const { quizId, studentId, answers, score, completedAt } = data;

        // Extra safety: prevent spoofing another user's data
        if (studentId !== user.$id) {
          return NextResponse.json({ error: 'Unauthorized student ID' }, { status: 403 });
        }

        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_QUIZ_ATTEMPTS_COLLECTION_ID!,
          ID.unique(),
          {
            quizId,
            studentId,
            answers,
            score,
            completedAt,
            syncedAt: new Date().toISOString(),
          }
        );
        break;
      }

      case 'submission': {
        const { assignmentId, studentId, content, fileUrl, submittedAt } = data;

        if (studentId !== user.$id) {
          return NextResponse.json({ error: 'Unauthorized student ID' }, { status: 403 });
        }

        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID!,
          ID.unique(),
          {
            assignmentId,
            studentId,
            content,
            fileUrl,
            submittedAt,
            syncedAt: new Date().toISOString(),
          }
        );
        break;
      }

      case 'material': {
        const { title, content, fileUrl, teacherId, createdAt } = data;

        await databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_MATERIALS_COLLECTION_ID!,
          ID.unique(),
          {
            title,
            content,
            fileUrl,
            teacherId,
            createdAt,
            syncedAt: new Date().toISOString(),
          }
        );
        break;
      }

      default:
        return NextResponse.json({ error: 'Unsupported sync type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SYNC API] Error:', error);
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}