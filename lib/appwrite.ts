import { Client, Account, Databases, Storage, Functions, ID, Query, Permission, Role } from 'appwrite';

// Validate environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.error('❌ Missing Appwrite configuration!');
  console.error('Please set up your .env.local file with Appwrite credentials.');
  console.error('See .env.local.example or QUICKSTART.md for instructions.');
}

const client = new Client()
  .setEndpoint(endpoint!)
  .setProject(projectId!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { ID, Query, Permission, Role };

export const config = {
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  storageId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
  collections: {
    users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
    assignments: process.env.NEXT_PUBLIC_APPWRITE_ASSIGNMENTS_COLLECTION_ID!,
    quizzes: process.env.NEXT_PUBLIC_APPWRITE_QUIZZES_COLLECTION_ID!,
    submissions: process.env.NEXT_PUBLIC_APPWRITE_SUBMISSIONS_COLLECTION_ID!,
    materials: process.env.NEXT_PUBLIC_APPWRITE_MATERIALS_COLLECTION_ID!,
    quizAttempts: process.env.NEXT_PUBLIC_APPWRITE_QUIZ_ATTEMPTS_COLLECTION_ID!,
    badges: process.env.NEXT_PUBLIC_APPWRITE_BADGES_COLLECTION_ID!,
    integrations: process.env.NEXT_PUBLIC_APPWRITE_INTEGRATIONS_COLLECTION_ID!,
    calendarEvents: process.env.NEXT_PUBLIC_APPWRITE_CALENDAR_EVENTS_COLLECTION_ID!,
    notifications: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID!,
    payments: process.env.NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID!,
    meetings: process.env.NEXT_PUBLIC_APPWRITE_MEETINGS_COLLECTION_ID!,
  },
};

export default client;
