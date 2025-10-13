'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Users, MessageSquare, Video, Share2, FileEdit, Paintbrush, Monitor } from 'lucide-react';

export default function CollaborationPage() {
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
          <Users className="w-20 h-20 text-blue-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Real-Time Collaboration
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Work together with classmates and teachers in real-time, fostering 
            engagement and collaborative learning.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.link}>
                <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-all hover:scale-105 cursor-pointer h-full border border-gray-700 hover:border-blue-500">
                  <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <span className="text-blue-400 font-medium">Try it now →</span>
                </div>
              </Link>
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
          <h2 className="text-4xl font-bold mb-6 text-white">Start Collaborating Today</h2>
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
    icon: FileEdit,
    title: 'Real-time Document Editing',
    description: 'Collaborate on documents with your classmates and teachers in real-time with live cursors and instant sync.',
    link: '/features/collaboration/documents',
  },
  {
    icon: Video,
    title: 'Video Conferencing',
    description: 'Host or join virtual classrooms for live lectures, interactive discussions, and face-to-face learning.',
    link: '/features/collaboration/video',
  },
  {
    icon: MessageSquare,
    title: 'Group Chat Rooms',
    description: 'Communicate instantly with teachers and peers through organized channels and direct messaging.',
    link: '/features/collaboration/chat',
  },
  {
    icon: Paintbrush,
    title: 'Interactive Whiteboard',
    description: 'Draw, sketch, and brainstorm together on a shared digital whiteboard with real-time synchronization.',
    link: '/features/collaboration/whiteboard',
  },
  {
    icon: Monitor,
    title: 'Screen Sharing',
    description: 'Share your screen or specific application windows for presentations and demonstrations.',
    link: '/features/collaboration/screen-sharing',
  },
  {
    icon: Users,
    title: 'Group Workspaces',
    description: 'Create dedicated spaces for team projects with shared resources and collaborative tools.',
    link: '/features/collaboration',
  },
];
