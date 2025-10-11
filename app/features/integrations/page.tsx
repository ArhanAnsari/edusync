'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Puzzle, Zap, Globe, Plug } from 'lucide-react';

export default function IntegrationsPage() {
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
          <Puzzle className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Powerful Integrations
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect EduSync with your favorite tools and platforms for a seamless 
            learning experience.
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
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Connect?</h2>
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
    icon: Plug,
    title: 'Easy Integration',
    description: 'Connect with popular learning management systems, productivity tools, and cloud storage platforms.',
  },
  {
    icon: Zap,
    title: 'API Access',
    description: 'Build custom integrations with our comprehensive REST API and extensive documentation.',
  },
  {
    icon: Globe,
    title: 'Third-Party Apps',
    description: 'Access a marketplace of third-party apps and plugins to extend EduSync functionality.',
  },
  {
    icon: Puzzle,
    title: 'Seamless Workflow',
    description: 'Automate tasks and create seamless workflows between EduSync and your other tools.',
  },
];
