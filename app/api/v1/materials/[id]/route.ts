import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { databases, config, account } from '@/lib/appwrite';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const role = user.labels?.[0];

    if (role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can delete materials' }, { status: 403 });
    }

    const { id } = await params;

    // Verify ownership
    const material = await databases.getDocument(
      config.databaseId,
      config.collections.materials,
      id
    );

    if (material.teacherId !== user.$id) {
      return NextResponse.json({ error: 'Not authorized to delete this material' }, { status: 403 });
    }

    await databases.deleteDocument(
      config.databaseId,
      config.collections.materials,
      id
    );

    return NextResponse.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
