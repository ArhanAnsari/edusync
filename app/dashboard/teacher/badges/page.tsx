'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, config, ID, Permission, Role } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Star, Trophy, Crown, Target, Zap, Check, X as XIcon, Flame, Heart, Lightbulb, Medal, Rocket, Shield, BookOpen, Brain, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

interface Student {
  $id: string;
  name?: string;
  fullName?: string;
  username?: string;
  email: string;
}

interface Badge {
  icon: any;
  name: string;
  description: string;
  color: string;
}

const availableBadges: Badge[] = [
  { icon: Star, name: 'Star Student', description: 'Excellent performance', color: 'bg-yellow-500' },
  { icon: Trophy, name: 'Quiz Master', description: 'Perfect quiz score', color: 'bg-blue-500' },
  { icon: Crown, name: 'Top Performer', description: 'Highest grades', color: 'bg-purple-500' },
  { icon: Target, name: 'Goal Achiever', description: 'Completed all assignments', color: 'bg-green-500' },
  { icon: Zap, name: 'Fast Learner', description: 'Quick completion', color: 'bg-orange-500' },
  { icon: Award, name: 'Perfect Attendance', description: 'Never missed a class', color: 'bg-pink-500' },
  { icon: Flame, name: 'On Fire', description: 'Consistent daily participation', color: 'bg-red-500' },
  { icon: Heart, name: 'Team Player', description: 'Excellent collaboration', color: 'bg-rose-500' },
  { icon: Lightbulb, name: 'Creative Thinker', description: 'Innovative solutions', color: 'bg-amber-500' },
  { icon: Medal, name: 'Champion', description: 'Winner of competition', color: 'bg-yellow-600' },
  { icon: Rocket, name: 'High Achiever', description: 'Exceeded expectations', color: 'bg-cyan-500' },
  { icon: Shield, name: 'Reliable', description: 'Consistent quality work', color: 'bg-indigo-500' },
  { icon: BookOpen, name: 'Bookworm', description: 'Extensive reading', color: 'bg-teal-500' },
  { icon: Brain, name: 'Critical Thinker', description: 'Outstanding analysis', color: 'bg-violet-500' },
  { icon: Clock, name: 'Punctual', description: 'Always on time', color: 'bg-emerald-500' },
  { icon: Users, name: 'Helper', description: 'Helps fellow students', color: 'bg-sky-500' },
];

export default function BadgeAwardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'teacher')) {
      router.push('/login');
    }
    if (user) {
      fetchStudents();
    }
  }, [user, authLoading, router]);

  const fetchStudents = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.users,
        []
      );
      const studentList = response.documents.filter((doc: any) => doc.role === 'student') as unknown as Student[];
      console.log('Fetched students:', studentList); // Debug log
      setStudents(studentList);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  // Helper function to get student display name
  const getStudentName = (student: Student) => {
    return student.name || student.fullName || student.username || student.email.split('@')[0] || 'Unknown';
  };

  const awardBadge = async () => {
    if (!selectedStudent || !selectedBadge || !user) return;

    setLoading(true);
    setMessage('');

    try {
      await databases.createDocument(
        config.databaseId,
        config.collections.badges,
        ID.unique(),
        {
          badgeId: ID.unique(),
          userId: selectedStudent.$id,
          name: selectedBadge.name,
          badgeName: selectedBadge.name,
          description: selectedBadge.description,
          badgeDescription: selectedBadge.description,
          badgeType: selectedBadge.name.toLowerCase().replace(/\s+/g, '_'),
          awardedBy: user.$id,
          awardedAt: new Date().toISOString(),
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      setMessage(`✅ Badge "${selectedBadge.name}" awarded to ${getStudentName(selectedStudent)}!`);
      setSelectedStudent(null);
      setSelectedBadge(null);
    } catch (error: any) {
      console.error('Error awarding badge:', error);
      setMessage(`❌ Failed to award badge: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const studentName = getStudentName(student);
    return studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (authLoading) {
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
            <Link href="/dashboard/teacher" className="flex items-center gap-2">
              <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Award Badges
              </span>
            </Link>
            <Link href="/dashboard/teacher">
              <Button variant="ghost">Back to Dashboard</Button>
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
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Award Student Badges
            </h1>
            <p className="text-gray-400">
              Recognize student achievements with badges
            </p>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-lg text-center font-semibold ${
                message.includes('✅') ? 'bg-green-600/20 text-green-400 border border-green-500/30' : 'bg-red-600/20 text-red-400 border border-red-500/30'
              }`}
            >
              {message}
            </motion.div>
          )}

          {/* Available Badges */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Available Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
                {availableBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedBadge?.name === badge.name
                          ? 'ring-2 ring-blue-500 bg-blue-600/20'
                          : 'hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedBadge(badge)}
                    >
                      <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-xs font-semibold text-center text-gray-200">{badge.name}</p>
                      {selectedBadge?.name === badge.name && (
                        <Check className="h-4 w-4 text-blue-400 mx-auto mt-2" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
              {selectedBadge && (
                <div className="mt-4 p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg">
                  <p className="text-sm font-semibold text-blue-400">{selectedBadge.name}</p>
                  <p className="text-xs text-blue-300">{selectedBadge.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Selection */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Select Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search" className="text-gray-300">Search Students</Label>
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredStudents.map((student) => {
                  const displayName = getStudentName(student);
                  return (
                    <motion.div
                      key={student.$id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedStudent?.$id === student.$id
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-gray-600 hover:border-blue-500'
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-white truncate">{displayName}</p>
                          <p className="text-xs text-gray-400 truncate">{student.email || 'No email'}</p>
                        </div>
                        {selectedStudent?.$id === student.$id && (
                          <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredStudents.length === 0 && (
                <p className="text-center text-gray-400 py-8">No students found</p>
              )}
            </CardContent>
          </Card>

          {/* Award Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={awardBadge}
              disabled={!selectedStudent || !selectedBadge || loading}
              className="px-8"
            >
              {loading ? (
                'Awarding...'
              ) : (
                <>
                  <Award className="mr-2 h-5 w-5" />
                  Award Badge
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer role="teacher" />
    </div>
  );
}
