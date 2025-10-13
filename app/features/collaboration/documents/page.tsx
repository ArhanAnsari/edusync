'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { FileEdit, Users, Clock, Save, ArrowLeft } from 'lucide-react';

export default function DocumentEditingPage() {
  const [content, setContent] = useState('Start typing here...');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeUsers, setActiveUsers] = useState(['You', 'Sarah (Student)', 'Mike (Teacher)']);
  const [autoSave, setAutoSave] = useState(true);

  // Auto-save simulation
  useEffect(() => {
    if (!autoSave) return;
    
    const timer = setInterval(() => {
      setLastSaved(new Date());
    }, 5000);

    return () => clearInterval(timer);
  }, [autoSave, content]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/features/collaboration" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300">Back to Collaboration</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="EduSync Logo" width={32} height={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduSync
            </span>
          </Link>

          <div className="flex gap-4">
            <Link href="/dashboard/student">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Title Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
                <FileEdit className="w-10 h-10 text-blue-400" />
                Real-time Document Editing
              </h1>
              <p className="text-gray-300">
                Collaborate on documents with your classmates and teachers in real-time
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <Card className="bg-gray-800 border-gray-700 p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">{activeUsers.length} active users</span>
                  <div className="flex gap-1 ml-2">
                    {activeUsers.map((user, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                        title={user}
                      >
                        {user[0]}
                      </div>
                    ))}
                  </div>
                </div>

                {lastSaved && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      Saved {lastSaved.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Auto-save
                </label>
                <Button size="sm" onClick={() => setLastSaved(new Date())}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Now
                </Button>
              </div>
            </div>
          </Card>

          {/* Editor */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[500px] bg-gray-900 text-gray-100 p-6 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none font-mono text-lg resize-none"
              placeholder="Start typing here... Your changes will be synced in real-time with other users."
            />
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 p-6">
                <feature.icon className="w-10 h-10 text-blue-400 mb-3" />
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Setup Note */}
          <Card className="bg-blue-900/20 border-blue-700 p-6 mt-8">
            <h3 className="text-xl font-bold mb-3 text-blue-400">🚀 Development Note</h3>
            <p className="text-gray-300 mb-4">
              This is a demo interface. To enable real-time collaboration, you'll need to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Set up a WebSocket server (Socket.io recommended)</li>
              <li>Implement Yjs for CRDT-based document sync</li>
              <li>Add TipTap or Quill for rich text editing</li>
              <li>Configure user presence and cursors</li>
              <li>Add version history and conflict resolution</li>
            </ul>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

const features = [
  {
    icon: Users,
    title: 'Real-time Sync',
    description: 'See changes from other users instantly as they type',
  },
  {
    icon: Clock,
    title: 'Auto-save',
    description: 'Never lose your work with automatic cloud backup',
  },
  {
    icon: Save,
    title: 'Version History',
    description: 'Track changes and restore previous versions anytime',
  },
];
