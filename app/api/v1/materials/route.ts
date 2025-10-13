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

    // Students see all materials, Teachers see only their materials
    const queries = role === 'teacher' 
      ? [Query.equal('teacherId', user.$id)]
      : [];

    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.materials,
      queries
    );

    return NextResponse.json({
      materials: response.documents,
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
    const role = user.labels?.[0];

    if (role !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create materials' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, fileUrl, subject } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description required' }, { status: 400 });
    }

    const material = await databases.createDocument(
      config.databaseId,
      config.collections.materials,
      'unique()',
      {
        title,
        description,
        fileUrl: fileUrl || '',
        subject: subject || 'General',
        teacherId: user.$id,
        teacherName: user.name,
        createdAt: new Date().toISOString(),
      }
    );

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
