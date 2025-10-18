import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { account, databases, config } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const GITHUB_API_URL = 'https://api.github.com';

// GitHub repository integration endpoint
export async function POST(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const body = await request.json();
    const { action, repoUrl, repoName, assignmentId, token } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // Handle different actions
    switch (action) {
      case 'link_repo': {
        if (!repoUrl || !repoName) {
          return NextResponse.json({ error: 'Repository URL and name are required' }, { status: 400 });
        }

        // Store repository link in database
        const integration = await databases.createDocument(
          config.databaseId,
          config.collections.integrations || 'integrations',
          ID.unique(),
          {
            userId: user.$id,
            type: 'github',
            repoUrl,
            repoName,
            linkedAt: new Date().toISOString(),
            status: 'active',
          }
        );

        return NextResponse.json({
          success: true,
          integration,
          message: 'Repository linked successfully',
        }, { status: 201 });
      }

      case 'fetch_repos': {
        if (!token) {
          return NextResponse.json({ error: 'GitHub token is required' }, { status: 400 });
        }

        // Fetch user's repositories from GitHub
        const response = await fetch(`${GITHUB_API_URL}/user/repos?sort=updated&per_page=50`, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch repositories from GitHub');
        }

        const repos = await response.json();
        
        return NextResponse.json({
          success: true,
          repositories: repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            url: repo.html_url,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            private: repo.private,
            updatedAt: repo.updated_at,
          })),
        });
      }

      case 'create_assignment_repo': {
        if (!token || !assignmentId) {
          return NextResponse.json({ error: 'GitHub token and assignment ID are required' }, { status: 400 });
        }

        // Fetch assignment details
        const assignment = await databases.getDocument(
          config.databaseId,
          config.collections.assignments,
          assignmentId
        );

        // Create a new repository for the assignment
        const repoData = {
          name: `assignment-${assignmentId}`,
          description: assignment.description || 'EduSync Assignment',
          private: false,
          auto_init: true,
        };

        const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(repoData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create repository');
        }

        const repo = await response.json();

        // Update assignment with GitHub repo link
        await databases.updateDocument(
          config.databaseId,
          config.collections.assignments,
          assignmentId,
          {
            githubRepo: repo.html_url,
            githubRepoName: repo.full_name,
          }
        );

        return NextResponse.json({
          success: true,
          repository: {
            name: repo.name,
            url: repo.html_url,
            cloneUrl: repo.clone_url,
          },
          message: 'Repository created and linked to assignment',
        }, { status: 201 });
      }

      case 'fetch_commits': {
        if (!token || !repoName) {
          return NextResponse.json({ error: 'GitHub token and repository name are required' }, { status: 400 });
        }

        const response = await fetch(`${GITHUB_API_URL}/repos/${repoName}/commits?per_page=10`, {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch commits');
        }

        const commits = await response.json();

        return NextResponse.json({
          success: true,
          commits: commits.map((commit: any) => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
            url: commit.html_url,
          })),
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Fetch user's linked repositories from database
    if (action === 'linked_repos') {
      const integrations = await databases.listDocuments(
        config.databaseId,
        config.collections.integrations || 'integrations',
        [
          Query.equal('userId', user.$id),
          Query.equal('type', 'github'),
          Query.equal('status', 'active'),
        ]
      );

      return NextResponse.json({
        success: true,
        repositories: integrations.documents,
      });
    }

    // Default: return integration status
    return NextResponse.json({
      success: true,
      status: 'ready',
      message: 'GitHub integration is ready. Use POST with actions: link_repo, fetch_repos, create_assignment_repo, fetch_commits',
    });
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await account.get();
    const { searchParams } = new URL(request.url);
    const integrationId = searchParams.get('id');

    if (!integrationId) {
      return NextResponse.json({ error: 'Integration ID is required' }, { status: 400 });
    }

    // Delete the integration
    await databases.deleteDocument(
      config.databaseId,
      config.collections.integrations || 'integrations',
      integrationId
    );

    return NextResponse.json({
      success: true,
      message: 'Repository unlinked successfully',
    });
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message 
    }, { status: 500 });
  }
}
