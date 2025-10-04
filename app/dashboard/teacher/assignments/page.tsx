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
import { Plus, Trash2, Save, BookOpen, Calendar, AlertCircle } from 'lucide-react';

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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-2">Create and manage assignments for your students</p>
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
          <Card className="p-8 bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Assignment</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Assignment Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Chapter 1 Essay"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed instructions for the assignment..."
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  onClick={() => setCreating(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createAssignment}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => {
              const overdue = isOverdue(assignment.dueDate);
              
              return (
                <Card key={assignment.$id} className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {assignment.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className={overdue ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {overdue && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-semibold">Overdue</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => deleteAssignment(assignment.$id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments yet</h3>
                <p className="text-gray-600 mb-6">Create your first assignment to get started</p>
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
