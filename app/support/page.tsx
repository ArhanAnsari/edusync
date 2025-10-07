'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle, Github, Twitter, HelpCircle, Book, Video } from 'lucide-react';
import Footer from '@/components/Footer';

export default function SupportPage() {
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
              Support & Help
            </h1>
            <p className="text-lg text-gray-600">
              We're here to help you with any questions or issues
            </p>
          </div>

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">How do I get started?</h3>
                <p className="text-sm text-gray-600">
                  Sign up for an account, choose your role (student or teacher), and start exploring the dashboard. Check out our documentation for a detailed guide.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I use EduSync offline?</h3>
                <p className="text-sm text-gray-600">
                  Yes! EduSync is built with offline-first architecture. You can access materials, take quizzes, and work on assignments even without internet. Changes sync automatically when you're back online.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How do I submit an assignment?</h3>
                <p className="text-sm text-gray-600">
                  Navigate to the Assignments page from your student dashboard, select the assignment, and use the submission form to submit your work.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">How does the badge system work?</h3>
                <p className="text-sm text-gray-600">
                  Teachers can award badges to recognize achievements. Badges are displayed on your student dashboard and track your progress.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Is my data secure?</h3>
                <p className="text-sm text-gray-600">
                  Yes! We use Appwrite for backend services with built-in security features. All data is encrypted and stored securely.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-gray-900" />
                  GitHub Issues
                </CardTitle>
                <CardDescription>Report bugs or request features</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="https://github.com/ArhanAnsari/edusync/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Open an Issue →
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email Support
                </CardTitle>
                <CardDescription>Get help via email</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="mailto:arhanansari2009@gmail.com" 
                  className="text-blue-600 hover:underline text-sm"
                >
                  arhanansari2009@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-green-600" />
                  Documentation
                </CardTitle>
                <CardDescription>Browse our guides</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/docs" className="text-blue-600 hover:underline text-sm">
                  View Documentation →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  Community
                </CardTitle>
                <CardDescription>Join the discussion</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="https://github.com/ArhanAnsari/edusync/discussions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Join Community →
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Demo Accounts */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Demo Accounts</CardTitle>
              <CardDescription className="text-blue-700">Test the platform with these demo credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">👨‍🏫 Teacher:</span>
                <code className="text-xs bg-white px-3 py-1 rounded text-blue-900">teacher@demo.com / demo1234</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-900">👨‍🎓 Student:</span>
                <code className="text-xs bg-white px-3 py-1 rounded text-blue-900">student@demo.com / demo1234</code>
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <div className="text-center mt-12">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-gray-600 mb-6">
              Check out our documentation or reach out through any of the channels above
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  <Book className="mr-2 h-4 w-4" />
                  Documentation
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
