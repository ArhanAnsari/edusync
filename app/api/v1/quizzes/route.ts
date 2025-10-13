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

    // Teachers see only their quizzes, students see all
    const queries = role === 'teacher' 
      ? [Query.equal('teacherId', user.$id)]
      : [];

    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.quizzes,
      queries
    );

    return NextResponse.json({
      quizzes: response.documents,
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
      return NextResponse.json({ error: 'Only teachers can create quizzes' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, questions, timeLimit, passingScore } = body;

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Title and questions required' }, { status: 400 });
    }

    const quiz = await databases.createDocument(
      config.databaseId,
      config.collections.quizzes,
      'unique()',
      {
        title,
        description: description || '',
        questions: JSON.stringify(questions),
        timeLimit: timeLimit || 30,
        passingScore: passingScore || 70,
        teacherId: user.$id,
        teacherName: user.name,
        createdAt: new Date().toISOString(),
      }
    );

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
