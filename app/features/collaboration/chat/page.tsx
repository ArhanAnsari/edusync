'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { MessageCircle, Send, Users, Hash, Plus, ArrowLeft, Smile } from 'lucide-react';

export default function ChatRoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: 'Prof. Smith', role: 'teacher', text: 'Welcome everyone! Ready for today\'s lesson?', time: '10:00 AM' },
    { id: 2, user: 'Sarah Johnson', role: 'student', text: 'Yes, excited to learn!', time: '10:01 AM' },
    { id: 3, user: 'Mike Chen', role: 'student', text: 'Can\'t wait!', time: '10:01 AM' },
  ]);

  const rooms = [
    { id: 'general', name: 'General', unread: 0 },
    { id: 'math-101', name: 'Math 101', unread: 3 },
    { id: 'physics', name: 'Physics Lab', unread: 0 },
    { id: 'project-team', name: 'Project Team', unread: 5 },
  ];

  const onlineUsers = [
    { name: 'Prof. Smith', status: 'online', role: 'teacher' },
    { name: 'Sarah Johnson', status: 'online', role: 'student' },
    { name: 'Mike Chen', status: 'online', role: 'student' },
    { name: 'Emma Davis', status: 'away', role: 'student' },
    { name: 'John Doe', status: 'offline', role: 'student' },
  ];

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      user: 'You',
      role: 'student',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
              <MessageCircle className="w-10 h-10 text-blue-400" />
              Group Chat Rooms
            </h1>
            <p className="text-gray-300 text-lg">
              Communicate with your classmates and teachers in organized channels
            </p>
          </div>

          {/* Chat Interface */}
          <div className="grid grid-cols-12 gap-4">
            {/* Rooms Sidebar */}
            <Card className="col-span-12 md:col-span-3 bg-gray-800 border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Channels</h3>
                <Button size="sm" variant="ghost">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedRoom === room.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-900 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Hash className="w-5 h-5" />
                    <span className="flex-1 text-left">{room.name}</span>
                    {room.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {room.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Chat Area */}
            <Card className="col-span-12 md:col-span-6 bg-gray-800 border-gray-700 p-0 flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="border-b border-gray-700 p-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Hash className="w-6 h-6 text-blue-400" />
                  {rooms.find((r) => r.id === selectedRoom)?.name}
                </h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {msg.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">{msg.user}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          msg.role === 'teacher' ? 'bg-purple-600' : 'bg-blue-600'
                        } text-white`}>
                          {msg.role}
                        </span>
                        <span className="text-xs text-gray-400">{msg.time}</span>
                      </div>
                      <p className="text-gray-300">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-700 p-4">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="bg-gray-900 border-gray-700 text-gray-100"
                  />
                  <Button onClick={sendMessage}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Online Users */}
            <Card className="col-span-12 md:col-span-3 bg-gray-800 border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Online ({onlineUsers.filter(u => u.status === 'online').length})</h3>
              </div>

              <div className="space-y-3">
                {onlineUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name[0]}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                        user.status === 'online' ? 'bg-green-500' :
                        user.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

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
              This is a demo interface. To enable real-time chat, implement:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Socket.io</strong> - For real-time message delivery</li>
              <li><strong>Pusher</strong> - Managed WebSocket service</li>
              <li>Message persistence with database</li>
              <li>File/image sharing capabilities</li>
              <li>Message reactions and threading</li>
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
    icon: MessageCircle,
    title: 'Instant Messaging',
    description: 'Send messages instantly with real-time delivery',
  },
  {
    icon: Users,
    title: 'Organized Channels',
    description: 'Create channels for different subjects and topics',
  },
  {
    icon: Hash,
    title: 'Rich Features',
    description: 'File sharing, reactions, threads, and more',
  },
];
