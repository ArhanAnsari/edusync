'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, config, Permission, Role } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, XCircle, Award, Users, TrendingUp, Sparkles, Copy, Check } from 'lucide-react';

interface Submission {
  $id: string;
  submissionId: string;
  assignmentId: string;
  userId: string;
  userName?: string; // Add optional userName field
  userEmail?: string; // Add optional userEmail field
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  $createdAt: string;
}

interface Assignment {
  $id: string;
  title: string;
}

interface User {
  $id: string;
  name: string;
  email: string;
}

export default function TeacherGradingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    suggestedGrade: number;
    suggestedFeedback: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      router.push('/dashboard/student');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [submissionsRes, assignmentsRes, usersRes] = await Promise.all([
        databases.listDocuments(config.databaseId, config.collections.submissions),
        databases.listDocuments(config.databaseId, config.collections.assignments),
        databases.listDocuments(config.databaseId, config.collections.users),
      ]);

      setSubmissions(submissionsRes.documents as unknown as Submission[]);
      setAssignments(assignmentsRes.documents as unknown as Assignment[]);
      setUsers(usersRes.documents as unknown as User[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssignmentTitle = (assignmentId: string) => {
    return assignments.find((a) => a.$id === assignmentId)?.title || 'Unknown Assignment';
  };

  const getUserName = (submission: Submission) => {
    // First, try to get name from the submission itself (new submissions)
    if (submission.userName) {
      return submission.userName;
    }
    
    // Fallback to looking up in users collection (old submissions)
    const userId = submission.userId;
    if (!userId) {
      return 'Unknown User';
    }
    
    const foundUser = users.find((u) => u.$id === userId);
    if (foundUser?.name) {
      return foundUser.name;
    }
    
    // Last resort: show truncated user ID
    return `User ${userId.substring(0, 8)}...`;
  };

  const openGrading = (submission: Submission) => {
    setGradingSubmission(submission);
    setGrade(submission.grade?.toString() || '');
    setFeedback(submission.feedback || '');
    setAiSuggestions(null);
  };

  const getAiGradingSuggestions = async () => {
    if (!gradingSubmission) return;

    setLoadingAi(true);
    try {
      const assignmentTitle = getAssignmentTitle(gradingSubmission.assignmentId);
      
      const response = await fetch('/api/ai/grading-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentPrompt: assignmentTitle,
          studentSubmission: gradingSubmission.content,
          rubric: 'Standard rubric: Content (30%), Clarity (20%), Grammar (20%), Originality (20%), Formatting (10%)',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      const feedbackText = data.feedback || '';
      
      // Parse feedback to extract grade and suggestions
      const gradeMatch = feedbackText.match(/Grade:\s*(\d+)/i);
      const suggestedGrade = gradeMatch ? parseInt(gradeMatch[1]) : 75;
      
      setAiSuggestions({
        suggestedGrade,
        suggestedFeedback: feedbackText,
      });
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      alert('Failed to generate AI suggestions');
    } finally {
      setLoadingAi(false);
    }
  };

  const useSuggestion = (type: 'grade' | 'feedback' | 'both') => {
    if (!aiSuggestions) return;

    if (type === 'grade' || type === 'both') {
      setGrade(aiSuggestions.suggestedGrade.toString());
    }

    if (type === 'feedback' || type === 'both') {
      setFeedback(aiSuggestions.suggestedFeedback);
    }

    setAiSuggestions(null);
  };

  const copyFeedback = () => {
    if (aiSuggestions) {
      navigator.clipboard.writeText(aiSuggestions.suggestedFeedback);
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    }
  };

  const submitGrade = async () => {
    if (!gradingSubmission || !grade) {
      alert('Please enter a grade');
      return;
    }

    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      alert('Grade must be between 0 and 100');
      return;
    }

    setSaving(true);
    try {
      await databases.updateDocument(
        config.databaseId,
        config.collections.submissions,
        gradingSubmission.$id,
        {
          grade: gradeNum,
          feedback,
        }
      );

      alert('Grade submitted successfully!');
      setGradingSubmission(null);
      setGrade('');
      setFeedback('');
      fetchData();
    } catch (error: any) {
      console.error('Error submitting grade:', error);
      alert('Failed to submit grade: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    if (grade >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusBadge = (submission: Submission) => {
    if (submission.grade !== undefined) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Graded
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        <XCircle className="w-4 h-4 mr-1" />
        Pending
      </Badge>
    );
  };

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter((s) => s.grade !== undefined).length;
  const pendingSubmissions = totalSubmissions - gradedSubmissions;
  const averageGrade =
    gradedSubmissions > 0
      ? (
          submissions
            .filter((s) => s.grade !== undefined)
            .reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions
        ).toFixed(1)
      : 'N/A';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Grading Center</h1>
          <p className="text-gray-400 mt-2">Review and grade student submissions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6 bg-gray-800 border-gray-700 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{totalSubmissions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gray-800 border-gray-700 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600/20 rounded-lg">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Graded</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{gradedSubmissions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gray-800 border-gray-700 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{pendingSubmissions}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-gray-800 border-gray-700 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg Grade</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{averageGrade}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Grading Modal */}
        {gradingSubmission && (
          <Card className="p-6 sm:p-8 bg-gray-800 border-2 border-blue-500 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Grade Submission</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div>
                  <p className="text-sm text-gray-400">Student</p>
                  <p className="font-semibold text-white">
                    {getUserName(gradingSubmission)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Assignment</p>
                  <p className="font-semibold text-white">
                    {getAssignmentTitle(gradingSubmission.assignmentId)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Submitted</p>
                  <p className="font-semibold text-white">
                    {new Date(gradingSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Submission Content</Label>
                <div className="mt-2 p-4 bg-gray-700 rounded-lg border border-gray-600 max-h-64 overflow-y-auto">
                  <p className="text-gray-100 whitespace-pre-wrap">{gradingSubmission.content}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="grade" className="text-gray-300">Grade (0-100) *</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="Enter grade"
                  className="mt-2 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="feedback" className="text-gray-300">Feedback</Label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback to the student..."
                  className="mt-2 w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100 placeholder-gray-500"
                  rows={4}
                />
                <div className="mt-3">
                  <Button
                    onClick={getAiGradingSuggestions}
                    disabled={loadingAi}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {loadingAi ? 'Generating...' : 'Get AI Suggestions'}
                  </Button>
                </div>
              </div>

              {aiSuggestions && (
                <Card className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-600/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h3 className="text-sm font-semibold text-purple-300">AI Suggestions</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-gray-700 rounded border border-gray-600">
                      <p className="text-xs text-gray-400 mb-2">Suggested Grade</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-purple-300">
                          {aiSuggestions.suggestedGrade}/100
                        </p>
                        <Button
                          onClick={() => useSuggestion('grade')}
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        >
                          Use Grade
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-700 rounded border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-400">Suggested Feedback</p>
                        <Button
                          onClick={copyFeedback}
                          size="sm"
                          className="bg-gray-600 hover:bg-gray-700 text-white text-xs"
                        >
                          {copiedFeedback ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-200 whitespace-pre-wrap mb-3 max-h-40 overflow-y-auto">
                        {aiSuggestions.suggestedFeedback}
                      </p>
                      <Button
                        onClick={() => useSuggestion('feedback')}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs w-full"
                      >
                        Use This Feedback
                      </Button>
                    </div>

                    <Button
                      onClick={() => useSuggestion('both')}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      size="sm"
                    >
                      Use All Suggestions
                    </Button>
                  </div>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
                <Button
                  onClick={() => setGradingSubmission(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitGrade}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <Award className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Submit Grade'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Submissions List */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Recent Submissions</h2>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.$id} className="p-4 sm:p-6 bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {getUserName(submission)}
                      </h3>
                      {getStatusBadge(submission)}
                    </div>
                    <p className="text-gray-400 mb-2">
                      Assignment: {getAssignmentTitle(submission.assignmentId)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                    {submission.grade !== undefined && (
                      <p className={`text-lg font-bold mt-2 ${getGradeColor(submission.grade)}`}>
                        Grade: {submission.grade}/100
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => openGrading(submission)}
                    className={`${
                      submission.grade !== undefined
                        ? 'bg-gray-600 hover:bg-gray-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white w-full sm:w-auto`}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    {submission.grade !== undefined ? 'Review' : 'Grade'}
                  </Button>
                </div>
              </Card>
            ))}

            {submissions.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No submissions yet</h3>
                <p className="text-gray-400">Submissions will appear here once students submit their work</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
