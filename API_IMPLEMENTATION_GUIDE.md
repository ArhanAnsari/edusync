# API v1 Implementation Guide

## Overview
This guide will help you implement the 9 API endpoints shown on the `/api` page.

## Quick Start

### Step 1: Create API v1 Directory Structure
```
app/api/v1/
├── user/
│   ├── route.ts          # GET user info
│   └── profile/
│       └── route.ts      # PUT update profile
├── materials/
│   ├── route.ts          # GET all, POST new
│   └── [id]/
│       └── route.ts      # DELETE material
├── quizzes/
│   └── route.ts          # GET all, POST new
└── assignments/
    └── route.ts          # GET all, POST submit
```

### Step 2: Implement User Endpoint

**File**: `app/api/v1/user/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await auth.getCurrentUser(sessionCookie.value);

    return NextResponse.json({
      id: user.$id,
      email: user.email,
      name: user.name,
      role: user.labels?.[0] || 'student',
      createdAt: user.$createdAt,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 3: Implement Materials Endpoint

**File**: `app/api/v1/materials/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { databases, config } from '@/lib/appwrite';
import { auth } from '@/lib/auth';
import { Query } from 'appwrite';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await auth.getCurrentUser(sessionCookie.value);
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

    const user = await auth.getCurrentUser(sessionCookie.value);
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
        fileUrl,
        subject,
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
```

### Step 4: Implement Materials Delete Endpoint

**File**: `app/api/v1/materials/[id]/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { databases, config } from '@/lib/appwrite';
import { auth } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await auth.getCurrentUser(sessionCookie.value);
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

    return NextResponse.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 5: Implement Quizzes Endpoint

**File**: `app/api/v1/quizzes/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { databases, config } from '@/lib/appwrite';
import { auth } from '@/lib/auth';
import { Query } from 'appwrite';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await auth.getCurrentUser(sessionCookie.value);
    const role = user.labels?.[0] || 'student';

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

    const user = await auth.getCurrentUser(sessionCookie.value);
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
        description,
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
```

### Step 6: Implement Assignments Endpoint

**File**: `app/api/v1/assignments/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { databases, config } from '@/lib/appwrite';
import { auth } from '@/lib/auth';
import { Query } from 'appwrite';

export async function GET() {
  try {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await auth.getCurrentUser(sessionCookie.value);
    const role = user.labels?.[0] || 'student';

    const queries = role === 'student'
      ? [Query.equal('studentId', user.$id)]
      : [Query.equal('teacherId', user.$id)];

    const response = await databases.listDocuments(
      config.databaseId,
      config.collections.assignments,
      queries
    );

    return NextResponse.json({
      assignments: response.documents,
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

    const user = await auth.getCurrentUser(sessionCookie.value);
    const body = await request.json();
    const { assignmentId, content, fileUrl } = body;

    if (!assignmentId || !content) {
      return NextResponse.json({ error: 'Assignment ID and content required' }, { status: 400 });
    }

    const submission = await databases.createDocument(
      config.databaseId,
      config.collections.submissions,
      'unique()',
      {
        assignmentId,
        studentId: user.$id,
        studentName: user.name,
        content,
        fileUrl,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      }
    );

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Step 7: Implement Profile Update Endpoint

**File**: `app/api/v1/user/profile/route.ts`
```typescript
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
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Testing the API

### Using curl (Windows PowerShell)

```powershell
# Test GET /api/v1/user
curl http://localhost:3000/api/v1/user `
  -H "Cookie: session=YOUR_SESSION_COOKIE"

# Test GET /api/v1/materials
curl http://localhost:3000/api/v1/materials `
  -H "Cookie: session=YOUR_SESSION_COOKIE"

# Test POST /api/v1/materials
curl -X POST http://localhost:3000/api/v1/materials `
  -H "Cookie: session=YOUR_SESSION_COOKIE" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Test Material\",\"description\":\"Test Description\",\"subject\":\"Math\"}'

# Test DELETE /api/v1/materials/:id
curl -X DELETE http://localhost:3000/api/v1/materials/MATERIAL_ID `
  -H "Cookie: session=YOUR_SESSION_COOKIE"

# Test POST /api/v1/quizzes
curl -X POST http://localhost:3000/api/v1/quizzes `
  -H "Cookie: session=YOUR_SESSION_COOKIE" `
  -H "Content-Type: application/json" `
  -d '{\"title\":\"Test Quiz\",\"questions\":[{\"question\":\"2+2?\",\"options\":[\"3\",\"4\"],\"correct\":1}]}'

# Test POST /api/v1/assignments (submit)
curl -X POST http://localhost:3000/api/v1/assignments `
  -H "Cookie: session=YOUR_SESSION_COOKIE" `
  -H "Content-Type: application/json" `
  -d '{\"assignmentId\":\"ASSIGNMENT_ID\",\"content\":\"My submission\"}'

# Test PUT /api/v1/user/profile
curl -X PUT http://localhost:3000/api/v1/user/profile `
  -H "Cookie: session=YOUR_SESSION_COOKIE" `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"New Name\"}'
```

## Adding API Key Authentication (Optional)

If you want API key authentication instead of session cookies:

**File**: `lib/api-keys.ts`
```typescript
import { databases, config } from './appwrite';
import { Query } from 'appwrite';

export async function validateApiKey(apiKey: string) {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      'api_keys', // Create this collection in Appwrite
      [Query.equal('key', apiKey)]
    );

    if (response.documents.length === 0) {
      return null;
    }

    const keyDoc = response.documents[0];
    return {
      userId: keyDoc.userId,
      permissions: keyDoc.permissions || [],
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return null;
  }
}
```

**Usage in routes**:
```typescript
// Add to any route
const apiKey = request.headers.get('X-API-Key');
if (apiKey) {
  const keyData = await validateApiKey(apiKey);
  if (!keyData) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
  // Use keyData.userId to get user info
}
```

## Rate Limiting (Optional)

**File**: `lib/rate-limit.ts`
```typescript
import { LRUCache } from 'lru-cache';

type Options = {
  interval: number;
  uniqueTokenPerInterval?: number;
};

export default function rateLimit(options: Options) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}

// Usage
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500,
});

export async function checkRateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  try {
    await limiter.check(10, ip); // 10 requests per minute
    return true;
  } catch {
    return false;
  }
}
```

## Next Steps

1. Create all the route files listed above
2. Test each endpoint with curl or Postman
3. Add error handling
4. Implement rate limiting
5. Add API documentation page
6. Consider adding OpenAPI/Swagger docs

## Documentation Page

Update `/app/api/page.tsx` to link to actual working endpoints and add a "Try it" section with authentication instructions.
