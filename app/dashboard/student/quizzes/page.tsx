'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { databases, config, ID, Permission, Role } from '@/lib/appwrite';
import { saveToOfflineDB } from '@/lib/offline-sync';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Award, CheckCircle, XCircle, Play, Send } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  $id: string;
  quizId: string;
  creatorId: string;
  name: string;
  description: string;
  timeLimit: number;
  maxAttempts: number;
  questions?: string;
  $createdAt: string;
}

interface QuizAttempt {
  $id: string;
  attemptId: string;
  quizId: string;
  userId: string;
  answers: string;
  score: number;
  completedAt: string;
}

export default function StudentQuizzesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Active quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);
  
  // Ref to prevent duplicate submissions (synchronous lock)
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (user?.role !== 'student') {
      router.push('/dashboard/teacher');
      return;
    }
    fetchQuizzes();
    fetchAttempts();

    // Check online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [user, router]);

  // Timer effect - simplified to prevent re-triggering
  useEffect(() => {
    if (!activeQuiz || !timeLeft || submitting) {
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Auto-submit when time runs out
          submitQuiz(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activeQuiz, submitting]);

  const fetchQuizzes = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.quizzes
      );
      setQuizzes(response.documents as unknown as Quiz[]);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    if (!user) return;
    try {
      const { Query } = await import('appwrite');
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.quizAttempts,
        [
          Query.equal('userId', user.$id) // CRITICAL FIX: Filter by current user only
        ]
      );
      setAttempts(response.documents as unknown as QuizAttempt[]);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    const parsedQuestions = JSON.parse(quiz.questions || '[]');
    setActiveQuiz(quiz);
    setQuestions(parsedQuestions);
    setTimeLeft(quiz.timeLimit * 60); // Convert to seconds
    setAnswers({});
    setCurrentAttemptId(ID.unique()); // Generate attempt ID once at start
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const submitQuiz = async (autoSubmit = false) => {
    // CRITICAL: Synchronous ref check - prevents duplicate submissions at entry point
    if (isSubmittingRef.current) {
      console.warn('Submission already in progress, blocking duplicate call');
      return;
    }

    if (!user || !activeQuiz || !currentAttemptId || !questions.length) {
      return;
    }

    if (!autoSubmit && Object.keys(answers).length < questions.length) {
      if (!confirm('You haven\'t answered all questions. Submit anyway?')) {
        return;
      }
    }

    // Set ref FIRST (synchronous) to block any concurrent calls
    isSubmittingRef.current = true;
    setSubmitting(true);
    
    try {
      // Calculate score
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      const score = Math.round((correctCount / questions.length) * 100);

      const attemptData = {
        attemptId: currentAttemptId, // Use the pre-generated attempt ID
        quizId: activeQuiz.quizId,
        userId: user.$id,
        answers: JSON.stringify(answers),
        score,
        attemptNumber: getAttemptCount(activeQuiz.quizId) + 1,
        completedAt: new Date().toISOString(),
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      };

      if (isOnline) {
        // Submit online
        await databases.createDocument(
          config.databaseId,
          config.collections.quizAttempts,
          attemptData.attemptId,
          attemptData,
          [
            Permission.read(Role.user(user.$id)),
            Permission.update(Role.user(user.$id)),
          ]
        );
        console.log('Quiz submitted successfully:', attemptData.attemptId);
        alert(`Quiz submitted! Your score: ${score}%`);
      } else {
        // Save offline
        await saveToOfflineDB('quiz_attempts', attemptData);
        alert(`Saved offline! Your score: ${score}%. Will sync when online.`);
      }

      // Reset quiz state
      setActiveQuiz(null);
      setQuestions([]);
      setAnswers({});
      setTimeLeft(0);
      setCurrentAttemptId(null);
      fetchAttempts();
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz: ' + error.message);
    } finally {
      // Always reset both the ref and state
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  const getAttemptCount = (quizId: string) => {
    return attempts.filter((a) => a.quizId === quizId).length;
  };

  const getBestScore = (quizId: string) => {
    const quizAttempts = attempts.filter((a) => a.quizId === quizId);
    if (quizAttempts.length === 0) return null;
    return Math.max(...quizAttempts.map((a) => a.score));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-400">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  // Active quiz view
  if (activeQuiz) {
    const progress = ((Object.keys(answers).length / questions.length) * 100).toFixed(0);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quiz Header */}
          <Card className="p-6 bg-gray-800 border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{activeQuiz.name}</h1>
                <p className="text-gray-400 mt-1">
                  Question {Object.keys(answers).length + 1} of {questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className={`w-6 h-6 ${timeLeft < 60 ? 'text-red-600' : 'text-blue-600'}`} />
                  <span className={timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{progress}% Complete</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            {questions.map((q, index) => (
              <Card key={q.id} className="p-6 bg-gray-800 border-gray-700 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-4">{q.question}</h3>
                    <div className="space-y-3">
                      {q.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => selectAnswer(q.id, optIndex)}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                            answers[q.id] === optIndex
                              ? 'border-blue-500 bg-blue-600/20'
                              : 'border-gray-600 hover:border-blue-400 bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                answers[q.id] === optIndex
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-400'
                              }`}
                            >
                              {answers[q.id] === optIndex && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <span className="text-gray-200">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <Card className="p-6 bg-gray-800 border-gray-700 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400">
                {Object.keys(answers).length === questions.length
                  ? 'All questions answered!'
                  : `${questions.length - Object.keys(answers).length} questions remaining`}
              </p>
              <Button
                onClick={() => submitQuiz(false)}
                disabled={submitting}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="w-5 h-5 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Available Quizzes</h1>
          <p className="text-gray-400 mt-2">Test your knowledge and track your progress</p>
          {!isOnline && (
            <Badge className="bg-yellow-100 text-yellow-800 mt-2">
              Offline Mode - Submissions will sync when online
            </Badge>
          )}
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quizzes.map((quiz) => {
            const questionCount = quiz.questions ? JSON.parse(quiz.questions).length : 0;
            const attemptCount = getAttemptCount(quiz.quizId);
            const bestScore = getBestScore(quiz.quizId);
            const canAttempt = attemptCount < quiz.maxAttempts;

            return (
              <Card key={quiz.$id} className="p-4 sm:p-6 bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  <Badge className="bg-blue-100 text-blue-800">
                    {questionCount} Questions
                  </Badge>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{quiz.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {quiz.description || 'No description'}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.timeLimit} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Award className="w-4 h-4" />
                    <span>
                      Attempts: {attemptCount}/{quiz.maxAttempts}
                    </span>
                  </div>
                  {bestScore !== null && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>Best Score: {bestScore}%</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => startQuiz(quiz)}
                  disabled={!canAttempt}
                  className={`w-full ${
                    canAttempt
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  } text-white`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  {canAttempt ? 'Start Quiz' : 'Max Attempts Reached'}
                </Button>
              </Card>
            );
          })}

          {quizzes.length === 0 && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No quizzes available</h3>
              <p className="text-gray-400">Check back later for new quizzes from your teachers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
