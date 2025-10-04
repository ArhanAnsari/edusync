'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ClipboardList, Trophy, LogOut, WifiOff, Wifi, FileCheck } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'teacher')) {
      router.push('/login');
    }

    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduSync
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Teacher Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Online/Offline Indicator */}
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-600">Offline</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || 'Teacher'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'teacher'}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'Teacher'}!</h1>
          <p className="text-gray-600 mb-8">Manage your classes and track student progress</p>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={Users}
              label="Total Students"
              value="0"
              color="blue"
            />
            <StatsCard
              icon={ClipboardList}
              label="Assignments"
              value="0"
              color="green"
            />
            <StatsCard
              icon={BookOpen}
              label="Quizzes"
              value="0"
              color="purple"
            />
            <StatsCard
              icon={Trophy}
              label="Avg. Score"
              value="N/A"
              color="orange"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ActionCard
              title="Study Materials"
              description="Upload and manage study materials for students"
              icon={BookOpen}
              href="/dashboard/teacher/materials"
              color="blue"
            />
            <ActionCard
              title="Create Assignment"
              description="Create new assignments with deadlines"
              icon={ClipboardList}
              href="/dashboard/teacher/assignments"
              color="green"
            />
            <ActionCard
              title="Create Quiz"
              description="Build interactive quizzes for your students"
              icon={BookOpen}
              href="/dashboard/teacher/quizzes"
              color="purple"
            />
            <ActionCard
              title="Grade Submissions"
              description="Review and grade student work"
              icon={FileCheck}
              href="/dashboard/teacher/grading"
              color="orange"
            />
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest submissions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <p>No recent activity yet</p>
                <p className="text-sm">Create your first assignment or quiz to get started!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActionCard({ title, description, icon: Icon, href, color }: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
