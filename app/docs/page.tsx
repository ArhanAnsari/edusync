'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Code, Database, Wifi, Award, FileText, Users, Zap } from 'lucide-react';
import Footer from '@/components/Footer';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>

          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost" className="dark:text-gray-300">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Documentation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to know about EduSync platform
            </p>
          </div>

          {/* Quick Start */}
          <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>Get started with EduSync in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 dark:text-gray-100">1. Create an Account</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sign up as a student or teacher to access the platform.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 dark:text-gray-100">2. Explore Your Dashboard</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Navigate through materials, quizzes, and assignments.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 dark:text-gray-100">3. Work Offline</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Access your content anytime, even without internet connection.</p>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upload and access learning materials in various formats. Download for offline access.</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">Create interactive quizzes with multiple question types. Attempt quizzes offline with auto-sync.</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">Submit assignments, track deadlines, and receive feedback from teachers.</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  Gamification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">Earn badges and track progress with achievement system.</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  Offline-First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">All features work offline with automatic synchronization when online.</p>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time updates and collaboration between teachers and students.</p>
              </CardContent>
            </Card>
          </div>

          {/* Technical Stack */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Technical Stack
              </CardTitle>
              <CardDescription>Built with modern technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Next.js 15</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">Framework</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="font-semibold text-purple-900 dark:text-purple-100">Appwrite</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">Backend</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="font-semibold text-green-900 dark:text-green-100">TypeScript</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Language</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100">Tailwind CSS</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Styling</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100">Appwrite Storage</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">Offline Storage</p>
                </div>
                <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <p className="font-semibold text-pink-900 dark:text-pink-100">Framer Motion</p>
                  <p className="text-xs text-pink-600 dark:text-pink-400">Animations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
