'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, BookOpen, FileQuestion, GraduationCap, Lightbulb, Zap, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';

interface Message {
  text: string;
  sender: 'user' | 'assistant';
  type?: 'text' | 'suggestion' | 'feature';
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
  category: 'student' | 'teacher' | 'both';
}

export default function AISmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'guest'>('guest');

  const [messages, setMessages] = useState<Message[]>([
    { 
      text: '👋 Hi! I\'m your AI-powered EduSync assistant. How can I help you today?', 
      sender: 'assistant',
      type: 'text'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick action buttons
  const quickActions: QuickAction[] = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: 'Explain Concept',
      prompt: 'Can you explain a concept to me?',
      category: 'both'
    },
    {
      icon: <FileQuestion className="w-4 h-4" />,
      label: 'Generate Quiz',
      prompt: 'Help me create quiz questions',
      category: 'teacher'
    },
    {
      icon: <GraduationCap className="w-4 h-4" />,
      label: 'Study Plan',
      prompt: 'Create a study plan for me',
      category: 'student'
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      label: 'Homework Help',
      prompt: 'I need help with my homework',
      category: 'student'
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: 'Assignment Ideas',
      prompt: 'Suggest creative assignment ideas',
      category: 'teacher'
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: 'Summarize Content',
      prompt: 'Can you summarize this content for me?',
      category: 'both'
    }
  ];

  // Filter quick actions based on user role
  const filteredQuickActions = quickActions.filter(
    action => action.category === 'both' || action.category === userRole
  );

  // Suggested prompts for first-time users
  const suggestedPrompts = userRole === 'student' 
    ? [
        'Help me understand photosynthesis',
        'Create a study schedule for finals',
        'Explain Newton\'s laws of motion',
        'How do I solve quadratic equations?'
      ]
    : userRole === 'teacher'
    ? [
        'Generate 10 multiple-choice questions on World War II',
        'Suggest engaging activities for teaching fractions',
        'Create a rubric for essay grading',
        'Give me tips for classroom management'
      ]
    : [
        'What is EduSync?',
        'How can AI help with learning?',
        'Tell me about your features',
        'How do I get started?'
      ];

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Detect user role from localStorage or context
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'student' | 'teacher' | null;
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

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

  // Enhanced AI-powered message handler
  const handleSendMessage = async (messageText?: string) => {
    const userMessage = messageText || inputMessage.trim();
    if (!userMessage || isTyping) return;

    // Add user message
    setMessages(prev => [...prev, { text: userMessage, sender: 'user', type: 'text' }]);
    setInputMessage('');
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      // Use AI chat endpoint
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          context: `User role: ${userRole}. Provide helpful, educational responses.`
        }),
      });

      if (!response.ok) {
        throw new Error('AI service unavailable');
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('0:')) {
              const content = line.slice(2).replace(/^"|"$/g, '');
              aiResponse += content;
              
              // Update message in real-time
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                
                if (lastMessage?.sender === 'assistant' && lastMessage.type === 'text') {
                  newMessages[newMessages.length - 1] = {
                    ...lastMessage,
                    text: aiResponse
                  };
                } else {
                  newMessages.push({
                    text: aiResponse,
                    sender: 'assistant',
                    type: 'text'
                  });
                }
                
                return newMessages;
              });
            }
          }
        }
      }

      // If no streaming response, add complete message
      if (!aiResponse) {
        const data = await response.json();
        setMessages(prev => [...prev, { 
          text: data.response || 'I received your message. How else can I help?', 
          sender: 'assistant',
          type: 'text'
        }]);
      }

    } catch (error) {
      console.error('AI Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          text: "I'm having trouble connecting to my AI brain right now 🤖. Please try again in a moment, or email arhanansari2009@gmail.com for immediate assistance.",
          sender: 'assistant',
          type: 'text'
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Handle quick action click
  const handleQuickAction = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Handle suggested prompt click
  const handleSuggestedPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes gradientPulse {
          0% {
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.6),
              0 0 20px rgba(168, 85, 247, 0.6),
              0 0 40px rgba(147, 51, 234, 0.6);
          }
          50% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
              0 0 40px rgba(168, 85, 247, 0.8),
              0 0 60px rgba(147, 51, 234, 0.8);
          }
          100% {
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.6),
              0 0 20px rgba(168, 85, 247, 0.6),
              0 0 40px rgba(147, 51, 234, 0.6);
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.5);
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.7);
        }

        .ai-message-content {
          line-height: 1.6;
        }

        .ai-message-content h1,
        .ai-message-content h2,
        .ai-message-content h3 {
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
          color: #e9d5ff;
        }

        .ai-message-content h1 {
          font-size: 1.5em;
          border-bottom: 2px solid rgba(139, 92, 246, 0.3);
          padding-bottom: 0.3em;
        }

        .ai-message-content h2 {
          font-size: 1.3em;
        }

        .ai-message-content h3 {
          font-size: 1.1em;
        }

        .ai-message-content p {
          margin-bottom: 0.8em;
        }

        .ai-message-content ul,
        .ai-message-content ol {
          margin-left: 1.5em;
          margin-bottom: 0.8em;
        }

        .ai-message-content li {
          margin-bottom: 0.3em;
        }

        .ai-message-content code {
          background: rgba(139, 92, 246, 0.2);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .ai-message-content pre {
          background: rgba(0, 0, 0, 0.3);
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin-bottom: 0.8em;
          border-left: 3px solid rgba(139, 92, 246, 0.5);
        }

        .ai-message-content pre code {
          background: none;
          padding: 0;
        }

        .ai-message-content blockquote {
          border-left: 3px solid rgba(139, 92, 246, 0.5);
          padding-left: 1em;
          margin-left: 0;
          font-style: italic;
          color: #d8b4fe;
        }

        .ai-message-content strong {
          font-weight: 600;
          color: #f3e8ff;
        }

        .ai-message-content em {
          font-style: italic;
          color: #e9d5ff;
        }

        .ai-message-content .katex {
          font-size: 1.1em;
        }

        .ai-message-content .katex-display {
          margin: 1em 0;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .ai-message-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        .ai-message-content th,
        .ai-message-content td {
          border: 1px solid rgba(139, 92, 246, 0.3);
          padding: 0.5em;
          text-align: left;
        }

        .ai-message-content th {
          background: rgba(139, 92, 246, 0.2);
          font-weight: 600;
        }

        .ai-message-content tr:nth-child(even) {
          background: rgba(139, 92, 246, 0.05);
        }
      `}</style>

      {/* Floating AI Assistant Button */}
      <AnimatePresence>
        {!isOpen && isVisible && (
          <motion.button
            key="ai-button"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full text-white shadow-2xl bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 hover:opacity-90 transition-all duration-300 backdrop-blur-lg group relative sm:bottom-8 sm:right-8 sm:p-5"
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI Assistant"
            title="AI Smart Assistant"
            style={{ 
              zIndex: 9999,
              position: 'fixed',
              pointerEvents: 'auto',
              animation: 'gradientPulse 3s ease-in-out infinite'
            }}
          >
            <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              AI Smart Assistant
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* AI Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-window"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="fixed bottom-4 right-4 z-[9999] w-[95vw] max-w-[420px] h-[85vh] max-h-[600px] sm:bottom-24 sm:right-6 sm:w-[420px] sm:h-[600px] rounded-2xl shadow-2xl border border-purple-200/20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 backdrop-blur-2xl text-white flex flex-col overflow-hidden"
            style={{ 
              zIndex: 9999,
              position: 'fixed',
              pointerEvents: 'auto'
            }}
          >
            {/* Header */}
            <div className="p-4 rounded-t-2xl flex items-center justify-between border-b border-purple-200/10 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-6 h-6 text-white" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI Smart Assistant</h3>
                  <p className="text-xs text-purple-100">Powered by Google Gemini</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition p-1 hover:bg-white/10 rounded-lg"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            {showQuickActions && messages.length <= 1 && (
              <div className="p-3 border-b border-purple-200/10 bg-black/20">
                <p className="text-xs text-purple-200 mb-2">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {filteredQuickActions.slice(0, 4).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-100 transition-all duration-200 hover:scale-105"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-100 backdrop-blur-sm border border-purple-200/20 shadow-md'
                    }`}
                  >
                    {message.sender === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 text-purple-300">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                    )}
                    {message.sender === 'assistant' ? (
                      <div className="ai-message-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath, remarkGfm]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              return inline ? (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              ) : (
                                <pre className={className}>
                                  <code {...props}>{children}</code>
                                </pre>
                              );
                            },
                            a({ node, children, ...props }: any) {
                              return (
                                <a
                                  {...props}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-300 hover:text-purple-200 underline"
                                >
                                  {children}
                                </a>
                              );
                            },
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap break-words">{message.text}</div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-purple-200/20 px-4 py-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested Prompts */}
              {messages.length === 1 && !isTyping && (
                <div className="space-y-2">
                  <p className="text-xs text-purple-300 text-center mb-3">Try asking:</p>
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      className="w-full text-left px-4 py-2 rounded-xl text-sm bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/20 text-purple-100 transition-all duration-200 hover:scale-[1.02]"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-purple-200/10 bg-black/40 backdrop-blur-xl"
            >
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  disabled={isTyping}
                  className="flex-1 bg-white/10 border-purple-400/30 text-white placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isTyping || !inputMessage.trim()}
                  className="rounded-xl bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 hover:opacity-90 transition shadow-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-purple-300/60 mt-2 text-center">
                Powered by AI • Responses may take a moment
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
