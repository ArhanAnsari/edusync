import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account } from '@/lib/appwrite';

export async function PUT(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedUser = await account.updateName(name);

    return NextResponse.json({
      id: updatedUser.$id,
      email: updatedUser.email,
      name: updatedUser.name,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
