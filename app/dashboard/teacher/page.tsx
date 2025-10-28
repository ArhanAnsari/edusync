'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { databases, config, realtime } from '@/lib/appwrite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ClipboardList, Trophy, LogOut, WifiOff, Wifi, FileCheck, Menu, X, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { syncPendingData } from '@/lib/offline-sync';
import { toast } from 'sonner';
import SyncIndicator from '@/components/SyncIndicator';

export default function TeacherDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Real-time stats
  const [stats, setStats] = useState({
    totalStudents: 0,
    assignments: 0,
    quizzes: 0,
    avgScore: 'N/A',
    materials: 0,
    pendingSubmissions: 0,
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'teacher')) {
      router.push('/login');
    }

    // Network status monitoring
    const handleOnline = async () => {
      setIsOnline(true);
      toast.success('Back Online! Syncing pending data...');
      await syncPendingData();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (user) {
      fetchStats();

      // Set up real-time subscriptions for all collections
      const setupRealtimeSubscriptions = async () => {
        try {
          const unsubscribers: Array<() => void> = [];

          // Watch users collection
          const usersUnsub = realtime.subscribe(
            [`databases.${config.databaseId}.collections.${config.collections.users}.documents`],
            () => fetchStats()
          );
          unsubscribers.push(() => usersUnsub());

          // Watch assignments collection
          const assignmentsUnsub = realtime.subscribe(
            [`databases.${config.databaseId}.collections.${config.collections.assignments}.documents`],
            () => fetchStats()
          );
          unsubscribers.push(() => assignmentsUnsub());

          // Watch quizzes collection
          const quizzesUnsub = realtime.subscribe(
            [`databases.${config.databaseId}.collections.${config.collections.quizzes}.documents`],
            () => fetchStats()
          );
          unsubscribers.push(() => quizzesUnsub());

          // Watch submissions collection
          const submissionsUnsub = realtime.subscribe(
            [`databases.${config.databaseId}.collections.${config.collections.submissions}.documents`],
            () => fetchStats()
          );
          unsubscribers.push(() => submissionsUnsub());

          // Watch quizAttempts collection
          const quizAttemptsUnsub = realtime.subscribe(
            [`databases.${config.databaseId}.collections.${config.collections.quizAttempts}.documents`],
            () => fetchStats()
          );
          unsubscribers.push(() => quizAttemptsUnsub());

          return unsubscribers;
        } catch (error) {
          console.error('Error setting up real-time subscriptions:', error);
          return [];
        }
      };

      let unsubscribers: Array<() => void> = [];
      setupRealtimeSubscriptions().then((unsubs) => {
        unsubscribers = unsubs;
      });

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        unsubscribers.forEach((unsub) => unsub());
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, loading, router]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [users, assignments, quizzes, materials, submissions, quizAttempts] = await Promise.all([
        databases.listDocuments(config.databaseId, config.collections.users),
        databases.listDocuments(config.databaseId, config.collections.assignments),
        databases.listDocuments(config.databaseId, config.collections.quizzes),
        databases.listDocuments(config.databaseId, config.collections.materials),
        databases.listDocuments(config.databaseId, config.collections.submissions),
        databases.listDocuments(config.databaseId, config.collections.quizAttempts),
      ]);

      // Count students
      const students = users.documents.filter((u: any) => u.role === 'student');
      
      // Count pending submissions
      const pending = submissions.documents.filter((s: any) => s.grade === undefined || s.grade === null);

      // Calculate average score from all quiz attempts
      const scores = quizAttempts.documents.map((a: any) => a.score).filter((s: number) => s !== undefined);
      const avgScore = scores.length > 0 
        ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)
        : 'N/A';

      setStats({
        totalStudents: students.length,
        assignments: assignments.documents.length,
        quizzes: quizzes.documents.length,
        avgScore: avgScore,
        materials: materials.documents.length,
        pendingSubmissions: pending.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} className="sm:w-8 sm:h-8" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduSync
                </span>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Teacher Dashboard</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/dashboard/teacher/materials" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Materials
              </Link>
              <Link href="/dashboard/teacher/quizzes" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Quizzes
              </Link>
              <Link href="/dashboard/teacher/assignments" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Assignments
              </Link>
              <Link href="/dashboard/teacher/grading" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Grading
              </Link>
              <Link href="/dashboard/teacher/integrations" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Integrations
              </Link>
            </div>

            {/* Sync Indicator */}
           <div className="hidden sm:flex items-center gap-3">
              <SyncIndicator />
           </div>

              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  {user?.name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium dark:text-gray-100">{user?.name || 'Teacher'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'teacher'}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={logout} className="hidden sm:flex">
                <LogOut className="h-5 w-5" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-2 border-t border-gray-700 pt-4">
              <Link
                href="/dashboard/teacher/materials"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Materials
              </Link>
              <Link
                href="/dashboard/teacher/quizzes"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quizzes
              </Link>
              <Link
                href="/dashboard/teacher/assignments"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assignments
              </Link>
              <Link
                href="/dashboard/teacher/grading"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Grading
              </Link>
              <Link
                href="/dashboard/teacher/integrations"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Integrations
              </Link>
              {/* Online/Offline + Sync Indicator - Mobile */}
          <div className="px-4 py-2 space-y-1">
           <div className="flex items-center gap-2">
          {isOnline ? (
          <>
          <Wifi className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-400">Online</span>
         </>
     ) : (
      <>
        <WifiOff className="h-4 w-4 text-orange-600" />
        <span className="text-sm text-orange-400">Offline</span>
      </>
    )}
  </div>

  {/* Subtle sync indicator */}
  <SyncIndicator />
</div>
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100">{user?.name || 'Teacher'}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role || 'teacher'}</p>
                </div>
              </div>
              <Button
                onClick={logout}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Welcome back, {user?.name || 'Teacher'}!</h1>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">Manage your classes and track student progress</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatsCard
              icon={Users}
              label="Total Students"
              value={stats.totalStudents.toString()}
              color="blue"
              onClick={() => router.push('/dashboard/teacher/students')}
            />
            <StatsCard
              icon={ClipboardList}
              label="Assignments"
              value={stats.assignments.toString()}
              color="green"
            />
            <StatsCard
              icon={BookOpen}
              label="Quizzes"
              value={stats.quizzes.toString()}
              color="purple"
            />
            <StatsCard
              icon={Trophy}
              label="Avg. Score"
              value={stats.avgScore}
              color="orange"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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

          {/* Additional Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <ActionCard
              title="Award Badges"
              description="Recognize student achievements with badges"
              icon={Award}
              href="/dashboard/teacher/badges"
              color="yellow"
              badge="New"
            />
            <ActionCard
              title="View Analytics"
              description="Track student progress and performance"
              icon={Trophy}
              href="/dashboard/teacher"
              color="indigo"
            />
          </div>

          {/* Recent Activity */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
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

      {/* Footer */}
      <Footer role="teacher" />
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, color, onClick }: {
  icon: any;
  label: string;
  value: string;
  color: string;
  onClick?: () => void;
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
      onClick={onClick}
      className={onClick ? 'cursor-pointer' : ''}
    >
      <Card className="dark:bg-gray-800 dark:border-gray-700 h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
              <p className="text-3xl font-bold dark:text-gray-100">{value}</p>
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

function ActionCard({ title, description, icon: Icon, href, color, badge }: {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  badge?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
    yellow: 'bg-yellow-600',
    indigo: 'bg-indigo-600',
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              {badge && (
                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded">
                  {badge}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
