'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';

export default function AnalyticsPage() {
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
          <BarChart3 className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Learning Analytics
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Track progress, identify strengths, and discover areas for improvement 
            with powerful analytics and insights.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-8 rounded-xl"
            >
              <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
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
          <h2 className="text-4xl font-bold mb-6 text-white">Start Tracking Your Progress</h2>
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
    icon: BarChart3,
    title: 'Performance Dashboard',
    description: 'Visualize your learning journey with comprehensive charts and graphs showing your progress over time.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor completion rates, quiz scores, and assignment submissions with detailed breakdowns.',
  },
  {
    icon: Target,
    title: 'Goal Setting',
    description: 'Set learning goals and track your progress towards achieving them with smart recommendations.',
  },
  {
    icon: Award,
    title: 'Achievement System',
    description: 'Earn badges and achievements as you master topics and reach learning milestones.',
  },
];
