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
import { AIChatbot } from '@/components/ai/ChatBot';

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
    assignmentsSubmitted: 0,
    totalAssignments: 0,
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
      
      // Set up real-time polling for stats (every 30 seconds)
      const statsInterval = setInterval(() => {
        fetchStats();
      }, 30000);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(statsInterval);
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
      const [materials, quizzes, assignments, quizAttempts, badges] = await Promise.all([
        databases.listDocuments(config.databaseId, config.collections.materials),
        databases.listDocuments(config.databaseId, config.collections.quizzes),
        databases.listDocuments(config.databaseId, config.collections.assignments),
        databases.listDocuments(config.databaseId, config.collections.quizAttempts),
        databases.listDocuments(config.databaseId, config.collections.badges),
      ]);

      // Filter user's quiz attempts
      const userAttempts = quizAttempts.documents.filter((a: any) => a.userId === user.$id);
      
      // Count unique quizzes attempted (not total attempts)
      const uniqueQuizzesAttempted = new Set(userAttempts.map((a: any) => a.quizId)).size;
      
      // Calculate average score
      const scores = userAttempts.map((a: any) => a.score).filter((s: number) => s !== undefined);
      const avgScore = scores.length > 0 
        ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)
        : 'N/A';

      // Filter user's badges
      const userBadges = badges.documents.filter((b: any) => b.userId === user.$id);
      
      // Count user's assignment submissions
      const submissions = await databases.listDocuments(config.databaseId, config.collections.submissions);
      const userSubmissions = submissions.documents.filter((s: any) => s.userId === user.$id);

      setStats({
        materials: materials.documents.length,
        quizzes: quizzes.documents.length,
        assignments: assignments.documents.length,
        avgScore: avgScore,
        badges: userBadges.length,
        quizzesCompleted: uniqueQuizzesAttempted,
        totalQuizzes: quizzes.documents.length,
        assignmentsSubmitted: userSubmissions.length,
        totalAssignments: assignments.documents.length,
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
              <span className="text-gray-300">Student Dashboard</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/dashboard/student/materials" className="text-sm text-gray-300 hover:text-blue-400">
                Materials
              </Link>
              <Link href="/dashboard/student/quizzes" className="text-sm text-gray-300 hover:text-blue-400">
                Quizzes
              </Link>
              <Link href="/dashboard/student/assignments" className="text-sm text-gray-300 hover:text-blue-400">
                Assignments
              </Link>
              <Link href="/dashboard/student/badges" className="text-sm text-gray-300 hover:text-yellow-400">
                Badges
              </Link>
              <Link href="/dashboard/student/integrations" className="text-sm text-gray-300 hover:text-purple-400">
                Premium
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
                  <p className="text-sm font-medium text-gray-100">{user?.name || 'Student'}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role || 'student'}</p>
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
                href="/dashboard/student/materials"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Materials
              </Link>
              <Link
                href="/dashboard/student/quizzes"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quizzes
              </Link>
              <Link
                href="/dashboard/student/assignments"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assignments
              </Link>
              <Link
                href="/dashboard/student/badges"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏆 My Badges
              </Link>
              <Link
                href="/dashboard/student/integrations"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                💎 Premium & Integrations
              </Link>
              
              {/* Online/Offline Status - Mobile */}
              <div className="flex items-center gap-2 px-4 py-2">
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
              
              {/* User Info - Mobile */}
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-100">{user?.name || 'Student'}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.role || 'student'}</p>
                </div>
              </div>
              
              <Button
                onClick={logout}
                className="w-full bg-red-600 hover:bg-red-700 text-white mx-4"
                style={{ width: 'calc(100% - 2rem)' }}
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">Welcome back, {user?.name || 'Student'}!</h1>
              <p className="text-gray-300">Continue your learning journey</p>
            </div>
            <Link href="/dashboard/student/badges">
              <motion.div 
                className="flex gap-2"
                key={stats.badges}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant="secondary" className="text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-500/30 cursor-pointer hover:bg-yellow-600/30 transition-colors">
                  <Trophy className="h-4 w-4 mr-2" />
                  {stats.badges} Badge{stats.badges !== 1 ? 's' : ''}
                </Badge>
              </motion.div>
            </Link>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Recent Materials</CardTitle>
                <CardDescription>Latest study materials from teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 text-gray-400">
                  <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-sm sm:text-base">No materials available yet</p>
                  <p className="text-xs sm:text-sm">Check back later for new content!</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Your Progress</CardTitle>
                <CardDescription>Track your learning achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Quizzes Completed</span>
                      <span className="text-sm font-semibold text-gray-100">{stats.quizzesCompleted}/{stats.totalQuizzes}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalQuizzes > 0 ? (stats.quizzesCompleted / stats.totalQuizzes) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Assignments Submitted</span>
                      <span className="text-sm font-semibold text-gray-100">{stats.assignmentsSubmitted}/{stats.totalAssignments}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${stats.totalAssignments > 0 ? (stats.assignmentsSubmitted / stats.totalAssignments) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Study Assistant */}
          <div className="mb-6 sm:mb-8">
            <AIChatbot 
              context={`Student: ${user?.name || 'Student'}\nCurrent subjects and materials available in EduSync. Help with understanding concepts, study strategies, and homework questions.`}
              title="AI Study Assistant"
              placeholder="Ask me anything about your studies..."
              minimized={true}
            />
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
    blue: 'bg-blue-900/30 text-blue-400',
    green: 'bg-green-900/30 text-green-400',
    purple: 'bg-purple-900/30 text-purple-400',
    orange: 'bg-orange-900/30 text-orange-400',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">{label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
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
        <Card className="h-full hover:shadow-lg hover:shadow-gray-900/50 transition-shadow cursor-pointer bg-gray-800 border-gray-700">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-white">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-400">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
