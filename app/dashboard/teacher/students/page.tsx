'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, config, realtime } from '@/lib/appwrite';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Mail, Phone, Calendar, User, BookOpen } from 'lucide-react';
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

export default function StudentListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (user?.role !== 'teacher') {
      router.push('/login');
      return;
    }
    fetchStudents();
    
    // Set up real-time subscription
    const setupRealtimeSubscription = async () => {
      try {
        const unsubscribe = realtime.subscribe(
          [`databases.${config.databaseId}.collections.${config.collections.users}.documents`],
          (response: any) => {
            // When data changes, update students
            if (response.events && response.events.length > 0) {
              fetchStudents();
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
  }, [user, router]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.users
      );

      // Filter only students
      const studentList = (response.documents as unknown as Student[]).filter(
        (doc) => doc.role === 'student'
      );

      setStudents(studentList);
      setFilteredStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (student) =>
          (student.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (student.phone || '').includes(searchTerm)
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((student) => student.status === selectedStatus);
    }

    setFilteredStudents(filtered);
  }, [searchTerm, selectedStatus, students]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Students ({filteredStudents.length})
          </h1>
          <p className="text-gray-300">
            View and manage all enrolled students
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Students Grid */}
        {filteredStudents.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700 p-8 text-center">
            <User className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">No students found</p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card
                key={student.$id}
                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors overflow-hidden"
              >
                <div className="p-6">
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {student.firstName ? student.firstName.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {student.firstName && student.lastName 
                              ? `${student.firstName} ${student.lastName}` 
                              : student.firstName || 'Unknown Student'}
                          </h3>
                          <Badge className={getStatusColor(student.status || 'active')}>
                            {student.status || 'Active'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-700">
                    {student.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <a
                          href={`mailto:${student.email}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {student.email}
                        </a>
                      </div>
                    )}
                    {student.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a
                          href={`tel:${student.phone}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {student.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Enrollment Info */}
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Enrolled: {formatDate(student.enrollmentDate || student.$createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-700 flex gap-2">
                    <Link href={`/dashboard/teacher/students/${student.$id}`} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {students.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-gray-800 border-gray-700 p-4">
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-white">{students.length}</p>
            </Card>
            <Card className="bg-gray-800 border-gray-700 p-4">
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400">
                {students.filter((s) => s.status === 'active' || !s.status).length}
              </p>
            </Card>
            <Card className="bg-gray-800 border-gray-700 p-4">
              <p className="text-gray-400 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-gray-400">
                {students.filter((s) => s.status === 'inactive').length}
              </p>
            </Card>
            <Card className="bg-gray-800 border-gray-700 p-4">
              <p className="text-gray-400 text-sm">Suspended</p>
              <p className="text-2xl font-bold text-red-400">
                {students.filter((s) => s.status === 'suspended').length}
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
