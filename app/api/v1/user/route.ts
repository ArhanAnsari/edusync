import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account } from '@/lib/appwrite';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from session
    const user = await account.get();

    return NextResponse.json({
      id: user.$id,
      email: user.email,
      name: user.name,
      role: user.labels?.[0] || 'student',
      createdAt: user.$createdAt,
      emailVerification: user.emailVerification,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
