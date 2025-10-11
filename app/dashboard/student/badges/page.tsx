'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, config } from '@/lib/appwrite';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Star, Trophy, Crown, Target, Zap, ArrowLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

interface Badge {
  $id: string;
  badgeId: string;
  userId: string;
  name: string;
  badgeName?: string;
  description: string;
  badgeDescription?: string;
  badgeType: string;
  awardedBy: string;
  awardedAt: string;
  $createdAt: string;
}

const badgeIcons: { [key: string]: any } = {
  'star_student': Star,
  'quiz_master': Trophy,
  'top_performer': Crown,
  'goal_achiever': Target,
  'fast_learner': Zap,
  'perfect_attendance': Award,
};

const badgeColors: { [key: string]: string } = {
  'star_student': 'bg-yellow-500',
  'quiz_master': 'bg-blue-500',
  'top_performer': 'bg-purple-500',
  'goal_achiever': 'bg-green-500',
  'fast_learner': 'bg-orange-500',
  'perfect_attendance': 'bg-pink-500',
};

export default function StudentBadgesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'student')) {
      router.push('/login');
    }
    if (user) {
      fetchBadges();
    }
  }, [user, authLoading, router]);

  const fetchBadges = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.badges
      );
      
      // Filter badges for current user
      const userBadges = response.documents.filter(
        (badge: any) => badge.userId === user.$id
      ) as unknown as Badge[];
      
      // Sort by newest first
      userBadges.sort((a, b) => 
        new Date(b.awardedAt || b.$createdAt).getTime() - 
        new Date(a.awardedAt || a.$createdAt).getTime()
      );
      
      setBadges(userBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badgeType: string) => {
    const Icon = badgeIcons[badgeType] || Award;
    return Icon;
  };

  const getBadgeColor = (badgeType: string) => {
    return badgeColors[badgeType] || 'bg-gray-500';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student" className="flex items-center gap-2">
              <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Badges
              </span>
            </Link>
            <Link href="/dashboard/student">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Title and Stats */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/50">
                <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Your Achievement Badges
            </h1>
            <p className="text-gray-400 mb-4">
              You've earned {badges.length} badge{badges.length !== 1 ? 's' : ''} so far!
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                <span className="text-yellow-400 font-semibold">{badges.length} Total Badges</span>
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge, index) => {
                const Icon = getBadgeIcon(badge.badgeType);
                const color = getBadgeColor(badge.badgeType);
                
                return (
                  <motion.div
                    key={badge.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Badge Icon */}
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-16 h-16 rounded-full ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                          >
                            <Icon className="h-8 w-8 text-white" />
                          </motion.div>

                          {/* Badge Info */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {badge.name || badge.badgeName || 'Badge'}
                            </h3>
                            <p className="text-sm text-gray-400 mb-3">
                              {badge.description || badge.badgeDescription || 'Achievement unlocked'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Earned on {new Date(badge.awardedAt || badge.$createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
                <CardContent className="p-8">
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-10 w-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No Badges Yet
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Keep working hard! Your teachers will award you badges for your achievements.
                  </p>
                  <Link href="/dashboard/student">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Achievement Tips */}
          {badges.length > 0 && (
            <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Keep Going!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  You're doing great! Continue completing assignments, acing quizzes, and participating actively to earn more badges.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <Footer role="student" />
    </div>
  );
}
