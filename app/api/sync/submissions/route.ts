import { NextResponse } from 'next/server';
import { databases, config } from '@/lib/appwrite';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await databases.createDocument(
      config.databaseId,
      config.collections.submissions,
      body.id,
      body
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sync submission failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
