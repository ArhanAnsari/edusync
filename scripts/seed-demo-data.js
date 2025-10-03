// Run this script to seed your Appwrite database with demo data
// Usage: node scripts/seed-demo-data.js

const sdk = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // Add this to .env.local

const databases = new sdk.Databases(client);
const users = new sdk.Users(client);

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collections = {
  users: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  badges: process.env.NEXT_PUBLIC_APPWRITE_BADGES_COLLECTION_ID,
};

async function seedBadges() {
  console.log('🏆 Seeding badges...');
  
  const badges = [
    {
      name: 'First Steps',
      description: 'Completed your first quiz',
      icon: '🌟',
      requirement: 'Complete 1 quiz',
      type: 'quiz',
    },
    {
      name: 'Quiz Master',
      description: 'Completed 10 quizzes',
      icon: '🎓',
      requirement: 'Complete 10 quizzes',
      type: 'quiz',
    },
    {
      name: 'Perfect Score',
      description: 'Got 100% on a quiz',
      icon: '💯',
      requirement: 'Score 100% on any quiz',
      type: 'quiz',
    },
    {
      name: 'Assignment Ace',
      description: 'Submitted 5 assignments',
      icon: '📝',
      requirement: 'Submit 5 assignments',
      type: 'assignment',
    },
    {
      name: 'On Time',
      description: 'Submitted 10 assignments before deadline',
      icon: '⏰',
      requirement: 'Submit 10 assignments on time',
      type: 'assignment',
    },
    {
      name: '7-Day Streak',
      description: 'Logged in for 7 consecutive days',
      icon: '🔥',
      requirement: 'Login 7 days in a row',
      type: 'streak',
    },
    {
      name: 'Offline Champion',
      description: 'Completed a quiz while offline',
      icon: '📴',
      requirement: 'Complete quiz in offline mode',
      type: 'special',
    },
  ];

  for (const badge of badges) {
    try {
      await databases.createDocument(
        databaseId,
        collections.badges,
        sdk.ID.unique(),
        badge
      );
      console.log(`✅ Created badge: ${badge.name}`);
    } catch (error) {
      console.log(`⚠️  Badge already exists: ${badge.name}`);
    }
  }
}

async function createDemoUsers() {
  console.log('👥 Creating demo users...');

  const demoUsers = [
    {
      id: 'demo-teacher',
      email: 'teacher@demo.com',
      password: 'demo1234',
      name: 'Demo Teacher',
    },
    {
      id: 'demo-student',
      email: 'student@demo.com',
      password: 'demo1234',
      name: 'Demo Student',
    },
  ];

  for (const user of demoUsers) {
    try {
      // Create user account
      const account = await users.create(
        user.id,
        user.email,
        undefined,
        user.password,
        user.name
      );
      
      // Create user profile
      await databases.createDocument(
        databaseId,
        collections.users,
        account.$id,
        {
          name: user.name,
          email: user.email,
          role: user.id.includes('teacher') ? 'teacher' : 'student',
          createdAt: new Date().toISOString(),
        }
      );
      
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    } catch (error) {
      console.log(`⚠️  User already exists: ${user.email}`);
    }
  }
}

async function main() {
  console.log('🚀 EduSync Demo Data Seeder\n');

  try {
    await seedBadges();
    console.log('\n');
    await createDemoUsers();
    console.log('\n✨ Demo data seeded successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('   Teacher: teacher@demo.com / demo1234');
    console.log('   Student: student@demo.com / demo1234\n');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
}

main();
