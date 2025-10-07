'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, config, ID, Permission, Role } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, AlertCircle, Send, CheckCircle, Clock } from 'lucide-react';
import Footer from '@/components/Footer';

interface Assignment {
  $id: string;
  assignmentId: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  submissionDate?: string;
  $createdAt: string;
}

interface Submission {
  $id: string;
  submissionId: string;
  assignmentId: string;
  userId: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export default function StudentAssignmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState<Assignment | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/dashboard/teacher');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [assignmentsRes, submissionsRes] = await Promise.all([
        databases.listDocuments(config.databaseId, config.collections.assignments),
        databases.listDocuments(config.databaseId, config.collections.submissions),
      ]);

      setAssignments(assignmentsRes.documents as unknown as Assignment[]);
      setSubmissions(submissionsRes.documents as unknown as Submission[]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubmission = (assignmentId: string) => {
    return submissions.find((s) => s.assignmentId === assignmentId && s.userId === user?.$id);
  };

  const submitAssignment = async () => {
    if (!user || !activeAssignment || !submissionContent.trim()) {
      alert('Please enter your submission content');
      return;
    }

    setSubmitting(true);
    try {
      const submissionId = ID.unique();
      await databases.createDocument(
        config.databaseId,
        config.collections.submissions,
        submissionId,
        {
          submissionId,
          assignmentId: activeAssignment.assignmentId,
          userId: user.$id,
          content: submissionContent,
          submittedAt: new Date().toISOString(),
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
        ]
      );

      alert('Assignment submitted successfully!');
      setActiveAssignment(null);
      setSubmissionContent('');
      fetchData();
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getStatusBadge = (assignment: Assignment) => {
    const submission = getSubmission(assignment.assignmentId);
    
    if (submission?.grade !== undefined) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Graded: {submission.grade}%
        </Badge>
      );
    }
    
    if (submission) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" />
          Submitted
        </Badge>
      );
    }

    if (isOverdue(assignment.dueDate)) {
      return (
        <Badge className="bg-red-100 text-red-800">
          <AlertCircle className="w-4 h-4 mr-1" />
          Overdue
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-100 text-yellow-800">
        <Clock className="w-4 h-4 mr-1" />
        Pending
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-2">View and submit your assignments</p>
        </div>

        {/* Submit Modal */}
        {activeAssignment && (
          <Card className="p-6 sm:p-8 bg-white shadow-lg border-2 border-blue-500">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Submit Assignment</h2>

            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{activeAssignment.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{activeAssignment.description}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(activeAssignment.dueDate).toLocaleString()}
                </p>
              </div>

              <div>
                <Label htmlFor="content">Your Submission *</Label>
                <textarea
                  id="content"
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Enter your assignment content here..."
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={10}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
                <Button
                  onClick={() => setActiveAssignment(null)}
                  className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitAssignment}
                  disabled={submitting}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {assignments.map((assignment) => {
            const submission = getSubmission(assignment.assignmentId);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <Card key={assignment.$id} className="p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  {getStatusBadge(assignment)}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                  {assignment.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className={overdue && !submission ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {submission ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                    {submission.grade !== undefined && (
                      <div>
                        <p className="text-lg font-bold text-blue-600">
                          Grade: {submission.grade}/100
                        </p>
                        {submission.feedback && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Feedback:</p>
                            <p className="text-sm text-gray-700">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => setActiveAssignment(assignment)}
                    disabled={overdue}
                    className={`w-full ${
                      overdue
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {overdue ? 'Overdue' : 'Submit'}
                  </Button>
                )}
              </Card>
            );
          })}

          {assignments.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No assignments yet</h3>
              <p className="text-sm sm:text-base text-gray-600">Check back later for new assignments from your teachers</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer role="student" />
    </div>
  );
}
