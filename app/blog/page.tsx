'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Introducing EduSync: Learning Without Limits',
    excerpt: 'Discover how EduSync is revolutionizing education with offline-first technology.',
    date: 'Oct 11, 2025',
    author: 'Arhan Ansari',
    category: 'Announcement',
  },
  {
    id: 2,
    title: '5 Benefits of Offline-First Learning Platforms',
    excerpt: 'Why offline-first architecture is the future of educational technology.',
    date: 'Oct 8, 2025',
    author: 'Arhan Ansari',
    category: 'Technology',
  },
  {
    id: 3,
    title: 'Building Collaborative Learning Experiences',
    excerpt: 'Best practices for creating engaging collaborative learning environments.',
    date: 'Oct 5, 2025',
    author: 'Arhan Ansari',
    category: 'Education',
  },
  {
    id: 4,
    title: 'The Power of Gamification in Education',
    excerpt: 'How badges and achievements boost student engagement and motivation.',
    date: 'Oct 1, 2025',
    author: 'Arhan Ansari',
    category: 'Education',
  },
  {
    id: 5,
    title: 'Progressive Web Apps for Education',
    excerpt: 'Why PWAs are perfect for creating accessible learning platforms.',
    date: 'Sep 28, 2025',
    author: 'Arhan Ansari',
    category: 'Technology',
  },
  {
    id: 6,
    title: 'Bridging the Digital Divide with Technology',
    excerpt: 'Making education accessible to students in low-connectivity areas.',
    date: 'Sep 25, 2025',
    author: 'Arhan Ansari',
    category: 'Social Impact',
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter blog posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return blogPosts;
    
    const query = searchQuery.toLowerCase();
    return blogPosts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Search Results Count */}
      {searchQuery && (
        <div className="container mx-auto px-4 pb-4">
          <p className="text-gray-400 text-center">
            Found {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Blog Posts */}
      <section className="container mx-auto px-4 py-16">
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold px-3 py-1 bg-black/30 rounded-full">
                        {post.category}
                      </span>
                    </div>
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found matching your search.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          </div>
        )}
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
          <div className="flex gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address"
              className="flex-1 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
