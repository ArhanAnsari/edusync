'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { Video, VideoOff, Mic, MicOff, Monitor, Users, ArrowLeft, Phone } from 'lucide-react';

export default function VideoConferencingPage() {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [participants] = useState([
    { name: 'You', role: 'Student', video: true },
    { name: 'Prof. Smith', role: 'Teacher', video: true },
    { name: 'Sarah Johnson', role: 'Student', video: true },
    { name: 'Mike Chen', role: 'Student', video: false },
  ]);

  const startCall = () => setInCall(true);
  const endCall = () => setInCall(false);

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
              <Video className="w-10 h-10 text-blue-400" />
              Video Conferencing
            </h1>
            <p className="text-gray-300 text-lg">
              Connect with your class through high-quality video calls
            </p>
          </div>

          {/* Video Grid */}
          {inCall ? (
            <>
              <Card className="bg-gray-800 border-gray-700 p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                  {participants.map((participant, index) => (
                    <div key={index} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      {participant.video ? (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                            {participant.name[0]}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <VideoOff className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white font-medium">{participant.name}</p>
                        <p className="text-gray-300 text-sm">{participant.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant={isMicOn ? 'default' : 'destructive'}
                    onClick={() => setIsMicOn(!isMicOn)}
                    className="w-16 h-16 rounded-full"
                  >
                    {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </Button>

                  <Button
                    size="lg"
                    variant={isVideoOn ? 'default' : 'destructive'}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="w-16 h-16 rounded-full"
                  >
                    {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                  </Button>

                  <Button
                    size="lg"
                    variant={isScreenSharing ? 'default' : 'outline'}
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className="w-16 h-16 rounded-full"
                  >
                    <Monitor className="w-6 h-6" />
                  </Button>

                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={endCall}
                    className="w-16 h-16 rounded-full"
                  >
                    <Phone className="w-6 h-6" />
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Join Call Card */}
              <Card className="bg-gray-800 border-gray-700 p-12 text-center mb-8">
                <Video className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4 text-white">Ready to Join?</h2>
                <p className="text-gray-300 mb-8 text-lg">
                  {participants.length} participants waiting in the room
                </p>
                <Button size="lg" onClick={startCall} className="px-12 py-6 text-lg">
                  Join Video Call
                </Button>
              </Card>
            </>
          )}

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
              This is a demo interface. To enable real video conferencing, integrate:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Daily.co</strong> - Easiest option with pre-built UI</li>
              <li><strong>Agora.io</strong> - Advanced features, good documentation</li>
              <li><strong>Jitsi</strong> - Open source, self-hosted option</li>
              <li><strong>WebRTC</strong> - Custom implementation for full control</li>
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
    title: 'Multi-party Calls',
    description: 'Support for up to 50 participants in a single call',
  },
  {
    icon: Monitor,
    title: 'Screen Sharing',
    description: 'Share your screen or whiteboard with students',
  },
  {
    icon: Video,
    title: 'HD Quality',
    description: 'Crystal clear video and audio for better learning',
  },
];
