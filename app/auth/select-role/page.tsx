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
  
  // Form fields for OAuth users
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

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
              const nameParts = accountData.name.split(' ');
              setUserData({
                userId: accountData.$id,
                name: accountData.name,
                email: accountData.email,
              });
              // Pre-fill name fields
              setFirstName(nameParts[0] || '');
              setLastName(nameParts.slice(1).join(' ') || '');
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
  }, [router]);

  const validatePassword = (pwd: string): string[] => {
    const errors = [];
    if (pwd.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pwd)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pwd)) errors.push('One number');
    return errors;
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    if (pwd) {
      setPasswordErrors(validatePassword(pwd));
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData) {
      setError('User information not available');
      return;
    }

    // Validation for OAuth users
    if (fromOAuth) {
      if (!firstName.trim()) {
        setError('First name is required');
        return;
      }
      if (!lastName.trim()) {
        setError('Last name is required');
        return;
      }
      if (!password) {
        setError('Password is required');
        return;
      }
      if (passwordErrors.length > 0) {
        setError('Password does not meet requirements');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const { databases, config, Permission, Role, account } = await import('@/lib/appwrite');
      
      const userDataToSave = {
        firstName: fromOAuth ? firstName.trim() : userData.name.split(' ')[0] || userData.name,
        lastName: fromOAuth ? lastName.trim() : userData.name.split(' ').slice(1).join(' ') || '',
        email: userData.email,
        role: role,
        username: `${firstName.toLowerCase().replace(/\s+/g, '')}.${lastName.toLowerCase().replace(/\s+/g, '')}` || userData.name.toLowerCase().replace(/\s+/g, ''),
        passwordHash: '', // For OAuth, we'll handle this separately
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create user profile in database
      await databases.createDocument(
        config.databaseId,
        config.collections.users,
        userData.userId,
        userDataToSave,
        [
          Permission.read(Role.user(userData.userId)),
          Permission.update(Role.user(userData.userId)),
          Permission.delete(Role.user(userData.userId)),
        ]
      );

      // If OAuth user, update their password for future logins
      if (fromOAuth && password) {
        try {
          await account.updatePassword(password);
        } catch (err) {
          console.warn('Could not update password (may not be needed for OAuth):', err);
        }
      }

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

              {/* OAuth user profile fields */}
              {fromOAuth && (
                <div className="space-y-4 pb-4 border-b border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData?.email || ''}
                      disabled
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    {password && passwordErrors.length > 0 && (
                      <div className="mt-2 p-2 bg-amber-900/30 border border-amber-700 rounded text-sm text-amber-300">
                        <p className="font-semibold mb-1">Password must have:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {passwordErrors.map((err) => (
                            <li key={err}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {password && passwordErrors.length === 0 && (
                      <p className="mt-2 text-sm text-green-400">✓ Password meets requirements</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className={`w-full bg-gray-700 border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 ${
                        confirmPassword && password !== confirmPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                      required
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">Passwords do not match</p>
                    )}
                    {confirmPassword && password === confirmPassword && password && (
                      <p className="mt-2 text-sm text-green-400">✓ Passwords match</p>
                    )}
                  </div>
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
