'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Monitor, MonitorOff, Users, Presentation, ArrowLeft, Play, Square } from 'lucide-react';

export default function ScreenSharingPage() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareType, setShareType] = useState<'screen' | 'window' | 'tab'>('screen');

  const startSharing = async () => {
    try {
      // Request screen sharing permission (would work in production)
      // const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsSharing(true);
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopSharing = () => {
    setIsSharing(false);
  };

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
          className="max-w-7xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-white flex items-center justify-center gap-3">
              <Monitor className="w-10 h-10 text-blue-400" />
              Screen Sharing
            </h1>
            <p className="text-gray-300 text-lg">
              Share your screen with students for presentations and demonstrations
            </p>
          </div>

          {/* Main Screen Share Area */}
          <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
            {isSharing ? (
              <>
                {/* Active Screen Share */}
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <Presentation className="w-24 h-24 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Screen is being shared</h3>
                    <p className="text-gray-300">5 people are viewing your {shareType}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button size="lg" variant="destructive" onClick={stopSharing}>
                    <Square className="w-5 h-5 mr-2" />
                    Stop Sharing
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Start Screen Share */}
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <MonitorOff className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No screen being shared</h3>
                    <p className="text-gray-400">Start sharing to present to your class</p>
                  </div>
                </div>

                {/* Share Options */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-4">Choose what to share:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setShareType('screen')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        shareType === 'screen'
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <Monitor className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <p className="text-white font-medium">Entire Screen</p>
                      <p className="text-gray-400 text-sm mt-2">Share everything on your screen</p>
                    </button>

                    <button
                      onClick={() => setShareType('window')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        shareType === 'window'
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <Presentation className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <p className="text-white font-medium">Application Window</p>
                      <p className="text-gray-400 text-sm mt-2">Share a specific program</p>
                    </button>

                    <button
                      onClick={() => setShareType('tab')}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        shareType === 'tab'
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                      }`}
                    >
                      <Monitor className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <p className="text-white font-medium">Browser Tab</p>
                      <p className="text-gray-400 text-sm mt-2">Share a single browser tab</p>
                    </button>
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <Button size="lg" onClick={startSharing} className="px-12">
                    <Play className="w-5 h-5 mr-2" />
                    Start Sharing
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Viewer Panel */}
          <Card className="bg-gray-800 border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Viewers ({viewers.length})</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {viewers.map((viewer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {viewer.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{viewer.name}</p>
                    <p className="text-gray-400 text-xs">{viewer.role}</p>
                  </div>
                </div>
              ))}
            </div>
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
              This demo uses the Screen Capture API. To implement in production:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Use <code className="bg-gray-800 px-2 py-1 rounded">navigator.mediaDevices.getDisplayMedia()</code></li>
              <li>Integrate with WebRTC for peer-to-peer streaming</li>
              <li>Or use Daily.co/Agora.io for managed screen sharing</li>
              <li>Add recording capabilities with MediaRecorder API</li>
              <li>Requires HTTPS for security</li>
            </ul>
          </Card>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

const viewers = [
  { name: 'Sarah Johnson', role: 'Student' },
  { name: 'Mike Chen', role: 'Student' },
  { name: 'Emma Davis', role: 'Student' },
  { name: 'John Doe', role: 'Student' },
  { name: 'Prof. Smith', role: 'Teacher' },
];

const features = [
  {
    icon: Monitor,
    title: 'Flexible Sharing',
    description: 'Share entire screen, specific window, or browser tab',
  },
  {
    icon: Presentation,
    title: 'HD Quality',
    description: 'High-definition screen sharing for clear presentations',
  },
  {
    icon: Users,
    title: 'Multiple Viewers',
    description: 'Share with entire class simultaneously',
  },
];
