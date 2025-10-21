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
import { Plus, Trash2, Save, BookOpen, Calendar, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';

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

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedSuggestion, setCopiedSuggestion] = useState(false);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      router.push('/dashboard/student');
      return;
    }
    fetchAssignments();
  }, [user, router]);

  const fetchAssignments = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.assignments
      );
      setAssignments(response.documents as unknown as Assignment[]);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async () => {
    if (!user || !title || !description || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const assignmentId = ID.unique();
      await databases.createDocument(
        config.databaseId,
        config.collections.assignments,
        assignmentId,
        {
          assignmentId,
          userId: user.$id,
          title,
          description,
          dueDate: new Date(dueDate).toISOString(),
          status: 'pending',
          submissionDate: null,
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      alert('Assignment created successfully!');
      setCreating(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchAssignments();
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      alert('Failed to create assignment: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await databases.deleteDocument(
        config.databaseId,
        config.collections.assignments,
        assignmentId
      );
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Failed to delete assignment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800';
      case 'graded':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAiSuggestions = async () => {
    if (!title.trim()) {
      alert('Please enter an assignment title first');
      return;
    }

    setLoadingAi(true);
    try {
      const response = await fetch('/api/ai/assignment-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: title,
          studentLevel: 'intermediate',
          numberOfSuggestions: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }

      const data = await response.json();
      setAiSuggestions(data.suggestions?.[0] || 'No suggestions available');
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      alert('Failed to generate AI suggestions');
    } finally {
      setLoadingAi(false);
    }
  };

  const useSuggestion = () => {
    if (aiSuggestions) {
      setDescription(aiSuggestions);
      setAiSuggestions(null);
    }
  };

  const copySuggestion = () => {
    if (aiSuggestions) {
      navigator.clipboard.writeText(aiSuggestions);
      setCopiedSuggestion(true);
      setTimeout(() => setCopiedSuggestion(false), 2000);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Assignments</h1>
            <p className="text-gray-400 mt-2">Create and manage assignments for your students</p>
          </div>
          <Button
            onClick={() => setCreating(!creating)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            {creating ? 'Cancel' : 'Create Assignment'}
          </Button>
        </div>

        {/* Create Assignment Form */}
        {creating && (
          <Card className="p-6 sm:p-8 bg-gray-800 border-gray-700 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Create New Assignment</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-gray-300">Assignment Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Chapter 1 Essay"
                  className="mt-2 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description *</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed instructions for the assignment..."
                  className="mt-2 w-full px-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={getAiSuggestions}
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
                      <h3 className="text-sm font-semibold text-purple-300">AI Suggestion</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copySuggestion}
                        size="sm"
                        className="bg-gray-600 hover:bg-gray-700 text-white text-xs"
                      >
                        {copiedSuggestion ? (
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
                      <Button
                        onClick={useSuggestion}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      >
                        Use This
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{aiSuggestions}</p>
                </Card>
              )}

              <div>
                <Label htmlFor="dueDate" className="text-gray-300">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-2 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
                <Button
                  onClick={() => setCreating(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createAssignment}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Creating...' : 'Create Assignment'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Assignments Grid */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">All Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {assignments.map((assignment) => {
              const overdue = isOverdue(assignment.dueDate);
              
              return (
                <Card key={assignment.$id} className="p-4 sm:p-6 bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{assignment.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 line-clamp-3">
                    {assignment.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className={overdue ? 'text-red-400 font-semibold' : 'text-gray-400'}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {overdue && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-semibold">Overdue</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => deleteAssignment(assignment.$id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </Card>
              );
            })}

            {assignments.length === 0 && !creating && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No assignments yet</h3>
                <p className="text-gray-400 text-sm sm:text-base mb-6">Create your first assignment to get started</p>
                <Button
                  onClick={() => setCreating(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Assignment
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
