'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { databases, config, realtime } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Calendar, User, FileText, Award, Clock } from 'lucide-react';
import Link from 'next/link';

interface Student {
  $id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  enrollmentDate?: string;
  role: string;
  status?: string;
  profilePicture?: string;
  $createdAt?: string;
}

interface StudentStats {
  submissions: number;
  completedAssignments: number;
  totalAssignments: number;
  quizzes: number;
  quizzesCompleted: number;
  avgScore: string;
  lastActivity?: string;
}

export default function StudentDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [stats, setStats] = useState<StudentStats>({
    submissions: 0,
    completedAssignments: 0,
    totalAssignments: 0,
    quizzes: 0,
    quizzesCompleted: 0,
    avgScore: 'N/A',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      router.push('/login');
      return;
    }

    if (!studentId) {
      setError('Student ID not found');
      setLoading(false);
      return;
    }

    fetchStudentDetails();

    // Set up real-time subscription for student data
    const setupRealtimeSubscription = async () => {
      try {
        const unsubscribe = realtime.subscribe(
          [`databases.${config.databaseId}.collections.${config.collections.users}.documents`],
          (response: any) => {
            if (response.events && response.events.length > 0) {
              fetchStudentDetails();
            }
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
      }
    };

    let unsubscribe: (() => void) | null = null;
    setupRealtimeSubscription().then((unsub) => {
      if (unsub) unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, router, studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch student document
      const studentDoc = await databases.getDocument(
        config.databaseId,
        config.collections.users,
        studentId
      );

      if (studentDoc.role !== 'student') {
        setError('This user is not a student');
        setLoading(false);
        return;
      }

      setStudent(studentDoc as unknown as Student);

      // Fetch student stats in parallel
      const [submissions, assignments, quizAttempts] = await Promise.all([
        databases.listDocuments(config.databaseId, config.collections.submissions),
        databases.listDocuments(config.databaseId, config.collections.assignments),
        databases.listDocuments(config.databaseId, config.collections.quizAttempts),
      ]);

      // Filter by student ID
      const studentSubmissions = submissions.documents.filter((s: any) => s.userId === studentId);
      const gradedSubmissions = studentSubmissions.filter((s: any) => s.grade !== undefined && s.grade !== null);
      const studentQuizAttempts = quizAttempts.documents.filter((a: any) => a.userId === studentId);
      const uniqueQuizzesAttempted = new Set(studentQuizAttempts.map((a: any) => a.quizId)).size;

      // Calculate average score
      const scores = studentQuizAttempts.map((a: any) => a.score).filter((s: number) => s !== undefined);
      const avgScore = scores.length > 0
        ? (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)
        : 'N/A';

      // Get last activity
      const lastActivity = studentSubmissions.length > 0
        ? new Date(studentSubmissions[0].$createdAt).toLocaleDateString()
        : undefined;

      setStats({
        submissions: studentSubmissions.length,
        completedAssignments: gradedSubmissions.length,
        totalAssignments: assignments.documents.length,
        quizzes: uniqueQuizzesAttempted,
        quizzesCompleted: uniqueQuizzesAttempted,
        avgScore: avgScore,
        lastActivity,
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Students
          </Button>
          <Card className="bg-gray-800 border-gray-700 p-8 text-center">
            <p className="text-gray-300 text-lg mb-4">{error || 'Student not found'}</p>
            <Link href="/dashboard/teacher/students">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Return to Students List
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Students
          </Button>

          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl text-white font-semibold">
                {student.firstName?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>

            {/* Student Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {student.firstName && student.lastName
                      ? `${student.firstName} ${student.lastName}`
                      : student.firstName || 'Unknown Student'}
                  </h1>
                  <p className="text-gray-400 mt-1">Student ID: {student.$id.substring(0, 8)}...</p>
                </div>
              </div>
              <Badge className={getStatusColor(student.status || 'active')} style={{ width: 'fit-content' }}>
                {student.status || 'Active'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {student.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href={`mailto:${student.email}`} className="text-blue-400 hover:text-blue-300">
                    {student.email}
                  </a>
                </div>
              </div>
            )}
            {student.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <a href={`tel:${student.phone}`} className="text-green-400 hover:text-green-300">
                    {student.phone}
                  </a>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Enrolled Date</p>
                <p className="text-white">{formatDate(student.enrollmentDate || student.$createdAt)}</p>
              </div>
            </div>
            {stats.lastActivity && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">Last Activity</p>
                  <p className="text-white">{stats.lastActivity}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Academic Statistics */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Academic Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-400">Assignments Submitted</p>
              <p className="text-2xl font-bold text-white mt-2">{stats.submissions}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-400">Graded</p>
              <p className="text-2xl font-bold text-green-400 mt-2">{stats.completedAssignments}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-400">Quizzes Taken</p>
              <p className="text-2xl font-bold text-blue-400 mt-2">{stats.quizzes}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-sm text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-purple-400 mt-2">{stats.avgScore}%</p>
            </div>
          </div>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Progress Overview</h2>
          
          {/* Assignment Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Assignment Completion</span>
              <span className="text-sm text-gray-400">
                {stats.completedAssignments} / {stats.submissions}
              </span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: stats.submissions > 0 ? `${(stats.completedAssignments / stats.submissions) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>

          {/* Quiz Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Quiz Attempts</span>
              <span className="text-sm text-gray-400">{stats.quizzes} quizzes</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                style={{
                  width: Math.min(100, (stats.quizzes / 10) * 100),
                }}
              ></div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href={`/dashboard/teacher/grading?studentId=${student.$id}`}>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              View Submissions
            </Button>
          </Link>
          <Link href="/dashboard/teacher/students">
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
