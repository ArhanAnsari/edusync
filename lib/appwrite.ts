import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.error('❌ Missing Appwrite configuration!');
  console.error('Please set up your .env.local file with Appwrite credentials.');
  console.error('See .env.local.example or QUICKSTART.md for instructions.');
}

const client = new Client()
  .setEndpoint(endpoint || 'https://cloud.appwrite.io/v1')
  .setProject(projectId || 'demo-project');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { ID, Query };

export const config = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || '',
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || 'users',
    assignments: process.env.NEXT_PUBLIC_APPWRITE_ASSIGNMENTS_COLLECTION_ID || 'assignments',
    quizzes: process.env.NEXT_PUBLIC_APPWRITE_QUIZZES_COLLECTION_ID || 'quizzes',
    submissions: process.env.NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID || 'submissions',
    materials: process.env.NEXT_PUBLIC_APPWRITE_MATERIALS_COLLECTION_ID || 'materials',
    quizAttempts: process.env.NEXT_PUBLIC_APPWRITE_QUIZ_ATTEMPTS_COLLECTION_ID || 'quiz_attempts',
    badges: process.env.NEXT_PUBLIC_APPWRITE_BADGES_COLLECTION_ID || 'badges',
  },
};

export default client;
