import { NextResponse } from 'next/server';
import { databases, config } from '@/lib/appwrite';
import { ID, Permission, Role } from 'appwrite';
import { getUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { assignmentId, studentId, content, fileUrl, submittedAt } = body;

    // 🧩 Validate incoming payload
    if (!assignmentId || !studentId || !content || !submittedAt) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 🧠 Prevent tampering with student ID
    if (studentId !== user.$id) {
      return NextResponse.json(
        { error: 'Unauthorized student ID' },
        { status: 403 }
      );
    }

    // 🗂️ Create submission document
    await databases.createDocument(
      config.databaseId,
      config.collections.submissions,
      ID.unique(),
      {
        assignmentId,
        studentId,
        content,
        fileUrl: fileUrl || null,
        submittedAt,
        syncedAt: new Date().toISOString(),
      },
      [
        // ✅ Fine-grained permissions
        Permission.read(Role.user(studentId)),   // student can read
        Permission.update(Role.user(studentId)), // optional (edit before graded)
        Permission.delete(Role.user(studentId)), // optional (withdraw submission)
        Permission.read(Role.role('teacher')),   // teachers can read for grading
        Permission.update(Role.role('teacher')), // teachers can update grades
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[SYNC API] Submissions error:', error);
    return NextResponse.json(
      { error: error?.message || 'Submission sync failed' },
      { status: 500 }
    );
  }
}