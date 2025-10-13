'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [messages, setMessages] = useState<
    Array<{ text: string; sender: 'user' | 'bot' }>
  >([{ text: 'Hi! How can I help you today?', sender: 'bot' }]);

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-minimize on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userMessage = inputMessage;
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
    setInputMessage('');
    setSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting. Please email arhanansari2009@gmail.com for immediate assistance.",
          sender: 'bot',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientPulse {
          0% {
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.6),
              0 0 20px rgba(139, 92, 246, 0.6),
              0 0 40px rgba(79, 70, 229, 0.6);
          }
          50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.8),
              0 0 40px rgba(139, 92, 246, 0.8),
              0 0 60px rgba(79, 70, 229, 0.8);
          }
          100% {
            box-shadow: 0 0 10px rgba(99, 102, 241, 0.6),
              0 0 20px rgba(139, 92, 246, 0.6),
              0 0 40px rgba(79, 70, 229, 0.6);
          }
        }
      `}</style>

      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && isVisible && (
          <motion.button
            key="chat-button"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full text-white shadow-xl
                       bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500
                       hover:opacity-90 transition-all duration-300 backdrop-blur-lg
                       animate-[gradientPulse_3s_ease-in-out_infinite]"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            aria-label="Open chat"
            title="Live Support"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[90vw] h-[500px]
                       rounded-2xl shadow-2xl border border-white/10
                       bg-black/60 backdrop-blur-2xl text-white flex flex-col"
          >
            {/* Header */}
            <div className="p-4 rounded-t-2xl flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">EduSync Support</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white'
                        : 'bg-white/10 text-gray-100 backdrop-blur-sm border border-white/10'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-white/10 bg-black/40 backdrop-blur-xl"
            >
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 border-white/10 text-white placeholder-gray-400 rounded-xl"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={sending}
                  className="rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:opacity-90 transition"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
