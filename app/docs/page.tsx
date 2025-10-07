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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>

          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
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
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Documentation
            </h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about EduSync platform
            </p>
          </div>

          {/* Quick Start */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-600" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>Get started with EduSync in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Create an Account</h3>
                <p className="text-sm text-gray-600">Sign up as a student or teacher to access the platform.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Explore Your Dashboard</h3>
                <p className="text-sm text-gray-600">Navigate through materials, quizzes, and assignments.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Work Offline</h3>
                <p className="text-sm text-gray-600">Access your content anytime, even without internet connection.</p>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Upload and access learning materials in various formats. Download for offline access.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Create interactive quizzes with multiple question types. Attempt quizzes offline with auto-sync.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Submit assignments, track deadlines, and receive feedback from teachers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Gamification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Earn badges and track progress with achievement system.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-indigo-600" />
                  Offline-First
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">All features work offline with automatic synchronization when online.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Real-time updates and collaboration between teachers and students.</p>
              </CardContent>
            </Card>
          </div>

          {/* Technical Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                Technical Stack
              </CardTitle>
              <CardDescription>Built with modern technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="font-semibold text-blue-900">Next.js 15</p>
                  <p className="text-xs text-blue-600">Framework</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-purple-900">Appwrite</p>
                  <p className="text-xs text-purple-600">Backend</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="font-semibold text-green-900">TypeScript</p>
                  <p className="text-xs text-green-600">Language</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="font-semibold text-yellow-900">Tailwind CSS</p>
                  <p className="text-xs text-yellow-600">Styling</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <p className="font-semibold text-indigo-900">Appwrite Storage</p>
                  <p className="text-xs text-indigo-600">Offline Storage</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <p className="font-semibold text-pink-900">Framer Motion</p>
                  <p className="text-xs text-pink-600">Animations</p>
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
