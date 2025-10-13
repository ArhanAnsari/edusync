import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account } from '@/lib/appwrite';

// GitHub repository integration endpoint
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const body = await request.json();
    const { repoUrl, action } = body;

    if (!repoUrl) {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 });
    }

    // TODO: Implement actual GitHub API integration
    // For now, return a placeholder response
    const integration = {
      id: `github_${Date.now()}`,
      repoUrl,
      action: action || 'link',
      status: 'connected',
      user: user.name,
      timestamp: new Date().toISOString(),
      message: 'Repository linked. Configure GitHub OAuth to access repository data.',
    };

    return NextResponse.json(integration, { status: 201 });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Fetch connected repositories
    return NextResponse.json({
      repositories: [],
      message: 'GitHub integration ready. Configure GitHub OAuth to list repositories.',
    });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
