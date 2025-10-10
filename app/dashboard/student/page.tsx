'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { databases, config } from '@/lib/appwrite';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Trophy, FileText, Download, LogOut, WifiOff, Wifi, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { ModeToggle } from '@/components/mode-toggle';

export default function StudentDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Real-time stats
  const [stats, setStats] = useState({
    materials: 0,
    quizzes: 0,
    assignments: 0,
    avgScore: 'N/A',
    badges: 0,
    quizzesCompleted: 0,
    totalQuizzes: 0,
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'student')) {
      router.push('/login');
    }

    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (user) {
      fetchStats();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, loading, router]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [materials, quizzes, assignments, quizAttempts, badges] = await Promise.all([
        databases.listDocuments(config.databaseId, config.collections.materials),
        databases.listDocuments(config.databaseId, config.collections.quizzes),
        databases.listDocuments(config.databaseId, config.collections.assignments),
        databases.listDocuments(config.databaseId, config.collections.quizAttempts),
        databases.listDocuments(config.databaseId, config.collections.badges),
      ]);

      // Filter user's quiz attempts
      const userAttempts = quizAttempts.documents.filter((a: any) => a.userId === user.$id);
      
      // Calculate average score
      const scores = userAttempts.map((a: any) => a.score).filter((s: number) => s !== undefined);
      const avgScore = scores.length > 0 
        ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)
        : 'N/A';

      // Filter user's badges
      const userBadges = badges.documents.filter((b: any) => b.userId === user.$id);

      setStats({
        materials: materials.documents.length,
        quizzes: quizzes.documents.length,
        assignments: assignments.documents.length,
        avgScore: avgScore,
        badges: userBadges.length,
        quizzesCompleted: userAttempts.length,
        totalQuizzes: quizzes.documents.length,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} className="sm:w-8 sm:h-8" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduSync
                </span>
              </Link>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">Student Dashboard</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/dashboard/student/materials" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Materials
              </Link>
              <Link href="/dashboard/student/quizzes" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Quizzes
              </Link>
              <Link href="/dashboard/student/assignments" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Assignments
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Online/Offline Indicator */}
              <div className="hidden sm:flex items-center gap-2">
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

              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium dark:text-gray-100">{user?.name || 'Student'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'student'}</p>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="hidden sm:flex">
                <ModeToggle />
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
            <div className="lg:hidden mt-4 pb-4 space-y-2 border-t pt-4">
              <Link
                href="/dashboard/student/materials"
                className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Materials
              </Link>
              <Link
                href="/dashboard/student/quizzes"
                className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quizzes
              </Link>
              <Link
                href="/dashboard/student/assignments"
                className="block px-4 py-2 text-gray-600 hover:bg-blue-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assignments
              </Link>
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || 'Student'}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role || 'student'}</p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
              <p className="text-gray-600">Continue your learning journey</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-base sm:text-lg px-3 sm:px-4 py-1 sm:py-2">
                <Trophy className="h-4 w-4 mr-2" />
                {stats.badges} Badges
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatsCard
              icon={BookOpen}
              label="Materials"
              value={stats.materials.toString()}
              color="blue"
            />
            <StatsCard
              icon={FileText}
              label="Quizzes"
              value={stats.quizzes.toString()}
              color="purple"
            />
            <StatsCard
              icon={FileText}
              label="Assignments"
              value={stats.assignments.toString()}
              color="green"
            />
            <StatsCard
              icon={Trophy}
              label="Avg. Score"
              value={stats.avgScore}
              color="orange"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <ActionCard
              title="Study Materials"
              description="Access all your study materials offline"
              icon={BookOpen}
              href="/dashboard/student/materials"
              color="blue"
              badge="Available Offline"
            />
            <ActionCard
              title="Take Quiz"
              description="Attempt quizzes even without internet"
              icon={FileText}
              href="/dashboard/student/quizzes"
              color="purple"
              badge="Offline Ready"
            />
            <ActionCard
              title="Assignments"
              description="View and submit your assignments"
              icon={FileText}
              href="/dashboard/student/assignments"
              color="green"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Materials</CardTitle>
                <CardDescription>Latest study materials from teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm sm:text-base">No materials available yet</p>
                  <p className="text-xs sm:text-sm">Check back later for new content!</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Your Progress</CardTitle>
                <CardDescription>Track your learning achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Quizzes Completed</span>
                      <span className="text-sm font-semibold">{stats.quizzesCompleted}/{stats.totalQuizzes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalQuizzes > 0 ? (stats.quizzesCompleted / stats.totalQuizzes) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Assignments Submitted</span>
                      <span className="text-sm font-semibold">0/0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer role="student" />
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
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
