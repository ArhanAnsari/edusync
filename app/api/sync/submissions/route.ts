import { NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { ID, Permission, Role } from 'appwrite';
import { getUser } from '@/lib/auth';
import { config } from '@/lib/appwrite';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { assignmentId, studentId, content, fileUrl, submittedAt } = body;

    if (studentId !== user.$id) {
      return NextResponse.json({ error: 'Unauthorized student ID' }, { status: 403 });
    }

    await databases.createDocument(
      config.databaseId,
      config.collections.submissions,
      ID.unique(),
      {
        assignmentId,
        studentId,
        content,
        fileUrl,
        submittedAt,
        syncedAt: new Date().toISOString(),
      },
      [
        // ✅ Permissions configuration
        Permission.read(Role.user(studentId)),          // student can read their own submission
        Permission.update(Role.user(studentId)),        // student can update (optional)
        Permission.delete(Role.user(studentId)),        // student can delete (optional)
        Permission.read(Role.role('teacher')),          // all teachers can read for grading
        Permission.update(Role.role('teacher')),        // teachers can update grades
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SYNC API] Submissions error:', error);
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}