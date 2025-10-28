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
    const { title, description, dueDate, createdAt } = body;

    if (!title || !description || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await databases.createDocument(
      config.databaseId,
      config.collections.assignments,
      ID.unique(),
      {
        title,
        description,
        dueDate,
        createdAt: createdAt || new Date().toISOString(),
        createdBy: user.$id,
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
    console.error('[SYNC API] Assignment error:', error);
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}