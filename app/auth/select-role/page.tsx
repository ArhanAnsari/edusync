'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

function RoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<{ userId: string; name: string; email: string } | null>(null);

  const userId = searchParams.get('userId');
  const name = searchParams.get('name') || 'User';
  const email = searchParams.get('email') || '';
  const fromOAuth = searchParams.get('fromOAuth') === 'true';

  useEffect(() => {
    const initUser = async () => {
      if (fromOAuth) {
        // OAuth user - get data from Appwrite session
        try {
          const { account } = await import('@/lib/appwrite');
          const accountData = await account.get();
          
          // Check if user already has a profile
          try {
            const { databases, config } = await import('@/lib/appwrite');
            const userProfile = await databases.getDocument(
              config.databaseId,
              config.collections.users,
              accountData.$id
            );
            
            // User already exists, redirect to dashboard
            const dashboardUrl = userProfile.role === 'teacher' 
              ? '/dashboard/teacher' 
              : '/dashboard/student';
            router.push(dashboardUrl);
            return;
          } catch (err: any) {
            // User doesn't exist, continue with role selection
            if (err.code === 404 || err.message?.includes('not found')) {
              setUserData({
                userId: accountData.$id,
                name: accountData.name,
                email: accountData.email,
              });
            } else {
              throw err;
            }
          }
        } catch (err: any) {
          console.error('Error getting OAuth user:', err);
          setError('Failed to get user information. Please try logging in again.');
        }
      } else if (userId) {
        // Direct link with user data
        setUserData({ userId, name, email });
      } else {
        // No user data available
        router.push('/login');
      }
    };

    initUser();
  }, [userId, name, email, fromOAuth, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      setError('User information not available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { databases, config, Permission, Role } = await import('@/lib/appwrite');
      
      // Create user profile in database
      await databases.createDocument(
        config.databaseId,
        config.collections.users,
        userData.userId,
        {
          firstName: userData.name.split(' ')[0] || userData.name,
          lastName: userData.name.split(' ').slice(1).join(' ') || '',
          email: userData.email,
          role: role,
          username: userData.name.toLowerCase().replace(/\s+/g, ''),
          passwordHash: '', // OAuth users don't have passwords
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        [
          Permission.read(Role.user(userData.userId)),
          Permission.update(Role.user(userData.userId)),
          Permission.delete(Role.user(userData.userId)),
        ]
      );

      // Redirect to appropriate dashboard
      const dashboardUrl = role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
      router.push(dashboardUrl);
    } catch (err: any) {
      console.error('Error creating user profile:', err);
      setError(err.message || 'Failed to complete registration');
      setLoading(false);
    }
  };

  if (!userData && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <Card className="bg-gray-800 border-gray-700 max-w-md w-full">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-4">Authentication Error</h2>
              <p className="text-red-400 mb-6">{error}</p>
              <Button 
                onClick={() => router.push('/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/logo.png" alt="EduSync Logo" width={48} height={48} />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Registration</h1>
          <p className="text-gray-400">Select your role to continue</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Welcome, {userData?.name || 'User'}!</CardTitle>
            <CardDescription className="text-gray-400">
              Choose your role to get started with EduSync
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">I am a:</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      role === 'student'
                        ? 'border-blue-600 bg-blue-600/20 text-white'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">👨‍🎓</div>
                    <div className="font-semibold">Student</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('teacher')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      role === 'teacher'
                        ? 'border-blue-600 bg-blue-600/20 text-white'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">👨‍🏫</div>
                    <div className="font-semibold">Teacher</div>
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={loading}
              >
                {loading ? 'Setting up your account...' : 'Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function SelectRolePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <RoleSelectionContent />
    </Suspense>
  );
}
