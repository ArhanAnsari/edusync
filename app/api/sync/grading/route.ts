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
    const { submissionId, grade, feedback } = body;

    if (!submissionId || grade === undefined) {
      return NextResponse.json({ error: 'Missing grading data' }, { status: 400 });
    }

    await databases.createDocument(
      config.databaseId,
      config.collections.grading,
      ID.unique(),
      {
        submissionId,
        grade,
        feedback: feedback || '',
        gradedBy: user.$id,
        gradedAt: new Date().toISOString(),
        syncedAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.role('teacher')),
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SYNC API] Grading error:', error);
    return NextResponse.json({ error: error.message || 'Grading sync failed' }, { status: 500 });
  }
}