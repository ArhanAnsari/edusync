'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Code, Book, Key, Zap } from 'lucide-react';

export default function APIPage() {
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
          <Code className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            EduSync API
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Build powerful integrations and extend EduSync with our comprehensive REST API
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/docs">
              <Button size="lg">
                <Book className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                <Key className="w-5 h-5 mr-2" />
                Get API Key
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">API Features</h2>
          <p className="text-gray-300 text-lg">
            Everything you need to build amazing integrations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Code Example */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Quick Start</h2>
          <div className="bg-gray-800 rounded-xl p-6 overflow-x-auto">
            <pre className="text-gray-300 text-sm">
              <code>{`// Example: Fetch user data
const response = await fetch('https://api.edusync.com/v1/user', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const userData = await response.json();
console.log(userData);`}</code>
            </pre>
          </div>
        </motion.div>
      </section>

      {/* Endpoints */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Available Endpoints</h2>
          <p className="text-gray-300 text-lg">
            Access all EduSync features through our REST API
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800 p-6 rounded-xl flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded text-sm font-mono ${
                    endpoint.method === 'GET' ? 'bg-green-900 text-green-300' :
                    endpoint.method === 'POST' ? 'bg-blue-900 text-blue-300' :
                    endpoint.method === 'PUT' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-gray-300">{endpoint.path}</code>
                </div>
                <p className="text-gray-400 text-sm">{endpoint.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Build?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get your API key and start building amazing integrations today
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-12">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: 'Fast & Reliable',
    description: 'High-performance API with 99.9% uptime and sub-100ms response times.',
  },
  {
    icon: Book,
    title: 'Well Documented',
    description: 'Comprehensive documentation with examples in multiple programming languages.',
  },
  {
    icon: Key,
    title: 'Secure',
    description: 'Industry-standard security with OAuth 2.0, API keys, and rate limiting.',
  },
];

const endpoints = [
  { method: 'GET', path: '/api/v1/user', description: 'Get current user information' },
  { method: 'GET', path: '/api/v1/materials', description: 'List all learning materials' },
  { method: 'POST', path: '/api/v1/materials', description: 'Create a new material' },
  { method: 'GET', path: '/api/v1/quizzes', description: 'List all quizzes' },
  { method: 'POST', path: '/api/v1/quizzes', description: 'Create a new quiz' },
  { method: 'GET', path: '/api/v1/assignments', description: 'List all assignments' },
  { method: 'POST', path: '/api/v1/assignments', description: 'Submit an assignment' },
  { method: 'PUT', path: '/api/v1/user/profile', description: 'Update user profile' },
  { method: 'DELETE', path: '/api/v1/materials/:id', description: 'Delete a material' },
];
