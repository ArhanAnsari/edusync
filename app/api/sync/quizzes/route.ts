import { NextResponse } from 'next/server';
import { databases, config } from '@/lib/appwrite';
import { ID, Permission, Role } from 'appwrite';
import { getUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, questions, createdAt } = body;

    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid quiz data' }, { status: 400 });
    }

    await databases.createDocument(
      config.databaseId,
      config.collections.quizzes,
      ID.unique(),
      {
        title,
        questions,
        createdBy: user.$id,
        createdAt: createdAt || new Date().toISOString(),
        syncedAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.role('teacher')),
        Permission.read(Role.role('student')),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SYNC API] Quiz error:', error);
    return NextResponse.json({ error: error.message || 'Quiz sync failed' }, { status: 500 });
  }
}