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
import { Plus, Trash2, Save, BookOpen, Clock, Award, Sparkles } from 'lucide-react';
import { QuizGenerator } from '@/components/ai/QuizGenerator';

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
  questions?: Question[];
  $createdAt: string;
}

export default function TeacherQuizzesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // New quiz form
  const [quizName, setQuizName] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    if (user?.role !== 'teacher') {
      router.push('/dashboard/student');
      return;
    }
    fetchQuizzes();
  }, [user, router]);

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

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: ID.unique(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    ]);
  };

  const handleAIGeneratedQuestions = (aiQuestions: any[]) => {
    const formattedQuestions = aiQuestions.map(q => ({
      id: ID.unique(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    }));
    setQuestions([...questions, ...formattedQuestions]);
    setShowAIGenerator(false);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveQuiz = async () => {
    if (!user || !quizName || questions.length === 0) {
      alert('Please fill in all required fields and add at least one question');
      return;
    }

    setSaving(true);
    try {
      const quizId = ID.unique();
      await databases.createDocument(
        config.databaseId,
        config.collections.quizzes,
        quizId,
        {
          quizId,
          creatorId: user.$id,
          name: quizName,
          description: quizDescription,
          timeLimit,
          maxAttempts,
          questions: JSON.stringify(questions),
          $createdAt: new Date().toISOString(),
          creationDate: new Date().toISOString(),
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ]
      );

      alert('Quiz created successfully!');
      setCreating(false);
      setQuizName('');
      setQuizDescription('');
      setTimeLimit(30);
      setMaxAttempts(3);
      setQuestions([]);
      fetchQuizzes();
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await databases.deleteDocument(
        config.databaseId,
        config.collections.quizzes,
        quizId
      );
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Quiz Manager</h1>
            <p className="text-gray-400 mt-2">Create and manage quizzes for your students</p>
          </div>
          <Button
            onClick={() => setCreating(!creating)}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            {creating ? 'Cancel' : 'Create Quiz'}
          </Button>
        </div>

        {/* Create Quiz Form */}
        {creating && (
          <Card className="p-6 sm:p-8 bg-gray-800 border-gray-700 shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Create New Quiz</h2>
            
            <div className="space-y-6">
              {/* Quiz Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="quizName" className="text-gray-300">Quiz Name *</Label>
                  <Input
                    id="quizName"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="e.g., Chapter 1 Quiz"
                    className="mt-2 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500"
                  />
                </div>

                <div>
                  <Label htmlFor="timeLimit" className="text-gray-300">Time Limit (minutes)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    className="mt-2 bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="maxAttempts" className="text-gray-300">Max Attempts</Label>
                  <Input
                    id="maxAttempts"
                    type="number"
                    value={maxAttempts}
                    onChange={(e) => setMaxAttempts(parseInt(e.target.value))}
                    className="mt-2 bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">Description</Label>
                <textarea
                  id="description"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  placeholder="Brief description of the quiz..."
                  className="mt-2 w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-gray-100 placeholder-gray-500"
                  rows={3}
                />
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Questions</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowAIGenerator(!showAIGenerator)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Generate
                    </Button>
                    <Button
                      onClick={addQuestion}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </div>

                {/* AI Quiz Generator */}
                {showAIGenerator && (
                  <div className="mb-6">
                    <QuizGenerator 
                      onQuestionsGenerated={handleAIGeneratedQuestions}
                      defaultTopic={quizName}
                    />
                  </div>
                )}

                <div className="space-y-6">
                  {questions.map((q, qIndex) => (
                    <Card key={q.id} className="p-6 bg-gray-700 border-gray-600">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-white">
                          Question {qIndex + 1}
                        </h4>
                        <Button
                          onClick={() => removeQuestion(qIndex)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-gray-300">Question Text *</Label>
                          <Input
                            value={q.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            placeholder="Enter your question..."
                            className="mt-2 bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-gray-300">Answer Options *</Label>
                          {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={q.correctAnswer === oIndex}
                                onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                className="w-5 h-5 text-blue-600"
                              />
                              <Input
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-1 bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400"
                              />
                            </div>
                          ))}
                          <p className="text-sm text-gray-400">
                            Select the radio button for the correct answer
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {questions.length === 0 && (
                    <p className="text-center text-gray-400 py-8">
                      No questions added yet. Click "Add Question" to get started.
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-700">
                <Button
                  onClick={() => setCreating(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveQuiz}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {saving ? 'Saving...' : 'Save Quiz'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Existing Quizzes */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {quizzes.map((quiz) => {
              const questionCount = quiz.questions 
                ? JSON.parse(quiz.questions as any).length 
                : 0;

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
                      <span>{quiz.maxAttempts} attempts allowed</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => deleteQuiz(quiz.$id)}
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

            {quizzes.length === 0 && !creating && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No quizzes yet</h3>
                <p className="text-gray-400 mb-6">Create your first quiz to get started</p>
                <Button
                  onClick={() => setCreating(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Quiz
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
