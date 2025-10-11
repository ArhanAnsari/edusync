'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>

          <div className="flex gap-4">
            <Link href="/docs">
              <Button variant="ghost" className="text-gray-300">Docs</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            EduSync Blog
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Latest updates, tips, and insights on education technology and offline learning
          </p>
        </motion.div>
      </section>

      {/* Blog Posts */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg mb-4" />
                  <CardTitle className="text-xl text-white">{post.title}</CardTitle>
                  <CardDescription className="text-gray-400">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <Button variant="link" className="p-0 text-blue-400 hover:text-blue-500">
                    Read More <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-gray-800 p-12 rounded-xl text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-white">Stay in the Loop</h2>
          <p className="text-gray-300 mb-6">
            Subscribe to our newsletter for the latest updates and educational insights
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button>Subscribe</Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

const blogPosts = [
  {
    title: 'Introducing EduSync: Learning Without Limits',
    excerpt: 'Discover how EduSync is revolutionizing education with offline-first technology.',
    date: 'Oct 11, 2025',
    author: 'Arhan Ansari',
  },
  {
    title: '5 Benefits of Offline-First Learning Platforms',
    excerpt: 'Why offline-first architecture is the future of educational technology.',
    date: 'Oct 8, 2025',
    author: 'Arhan Ansari',
  },
  {
    title: 'Building Collaborative Learning Experiences',
    excerpt: 'Best practices for creating engaging collaborative learning environments.',
    date: 'Oct 5, 2025',
    author: 'Arhan Ansari',
  },
  {
    title: 'The Power of Gamification in Education',
    excerpt: 'How badges and achievements boost student engagement and motivation.',
    date: 'Oct 1, 2025',
    author: 'Arhan Ansari',
  },
  {
    title: 'Progressive Web Apps for Education',
    excerpt: 'Why PWAs are perfect for creating accessible learning platforms.',
    date: 'Sep 28, 2025',
    author: 'Arhan Ansari',
  },
  {
    title: 'Bridging the Digital Divide with Technology',
    excerpt: 'Making education accessible to students in low-connectivity areas.',
    date: 'Sep 25, 2025',
    author: 'Arhan Ansari',
  },
];
