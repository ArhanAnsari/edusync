export type UserRole = 'student' | 'teacher';

export interface User {
  $id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Material {
  $id: string;
  title: string;
  description: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  $id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  teacherId: string;
  teacherName: string;
  subject: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  $id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  status: 'pending' | 'graded';
}

export interface Quiz {
  $id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  teacherId: string;
  teacherName: string;
  subject: string;
  duration: number; // in minutes
  totalPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface QuizAttempt {
  $id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  answers: number[];
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: string;
  timeSpent: number; // in seconds
}

export interface Badge {
  $id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  type: 'quiz' | 'assignment' | 'streak' | 'special';
}

export interface UserBadge {
  $id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
}

export interface DashboardStats {
  totalStudents?: number;
  totalAssignments?: number;
  totalQuizzes?: number;
  totalMaterials?: number;
  pendingSubmissions?: number;
  completedQuizzes?: number;
  averageScore?: number;
  badges?: number;
}
