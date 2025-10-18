/**
 * AI Chatbot Component
 * Reusable AI chat interface for student assistance
 * With LaTeX and Markdown rendering support
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

interface AIChatbotProps {
  context?: string;
  placeholder?: string;
  title?: string;
  minimized?: boolean;
}

export function AIChatbot({
  context,
  placeholder = 'Ask me anything about your studies...',
  title = 'AI Study Assistant',
  minimized = false,
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(!minimized);
  const [isMinimized, setIsMinimized] = useState(minimized);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/answer-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMessage.content,
          context,
          previousMessages: messages.slice(-4), // Last 4 messages for context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        id: (Date.now() + 1).toString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  // If minimized, show floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Open AI Assistant
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
        <div className="flex gap-2">
          {minimized && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setIsMinimized(true);
              }}
            >
              Minimize
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <style jsx global>{`
          /* Markdown and LaTeX styling for ChatBot messages */
          .chatbot-message-content {
            line-height: 1.6;
          }

          .chatbot-message-content h1,
          .chatbot-message-content h2,
          .chatbot-message-content h3 {
            font-weight: 600;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }

          .chatbot-message-content h1 {
            font-size: 1.5em;
            border-bottom: 2px solid hsl(var(--border));
            padding-bottom: 0.3em;
          }

          .chatbot-message-content h2 {
            font-size: 1.3em;
          }

          .chatbot-message-content h3 {
            font-size: 1.1em;
          }

          .chatbot-message-content p {
            margin-bottom: 0.8em;
          }

          .chatbot-message-content ul,
          .chatbot-message-content ol {
            margin-left: 1.5em;
            margin-bottom: 0.8em;
          }

          .chatbot-message-content li {
            margin-bottom: 0.3em;
          }

          .chatbot-message-content code {
            background: hsl(var(--muted));
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
          }

          .chatbot-message-content pre {
            background: hsl(var(--muted));
            padding: 1em;
            border-radius: 8px;
            overflow-x: auto;
            margin-bottom: 0.8em;
            border-left: 3px solid hsl(var(--primary));
          }

          .chatbot-message-content pre code {
            background: none;
            padding: 0;
          }

          .chatbot-message-content blockquote {
            border-left: 3px solid hsl(var(--primary));
            padding-left: 1em;
            margin-left: 0;
            font-style: italic;
            opacity: 0.9;
          }

          .chatbot-message-content strong {
            font-weight: 600;
          }

          .chatbot-message-content em {
            font-style: italic;
          }

          /* KaTeX math styling */
          .chatbot-message-content .katex {
            font-size: 1.1em;
          }

          .chatbot-message-content .katex-display {
            margin: 1em 0;
            overflow-x: auto;
            overflow-y: hidden;
          }

          /* Enhanced table styling */
          .chatbot-message-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
          }

          .chatbot-message-content th,
          .chatbot-message-content td {
            border: 1px solid hsl(var(--border));
            padding: 0.5em;
            text-align: left;
          }

          .chatbot-message-content th {
            background: hsl(var(--muted));
            font-weight: 600;
          }

          .chatbot-message-content tr:nth-child(even) {
            background: hsl(var(--muted) / 0.3);
          }

          /* Horizontal rules */
          .chatbot-message-content hr {
            border: none;
            border-top: 1px solid hsl(var(--border));
            margin: 1.5em 0;
          }
        `}</style>

        {/* Messages Area */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-500 opacity-50" />
                <p className="text-sm">
                  Hi! I&apos;m your AI study assistant. Ask me anything!
                </p>
                <div className="mt-4 space-y-2 text-xs">
                  <p>Try asking:</p>
                  <ul className="space-y-1">
                    <li>• Explain a concept</li>
                    <li>• Help with homework</li>
                    <li>• Study tips and strategies</li>
                    <li>• Review material</li>
                  </ul>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="chatbot-message-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath, remarkGfm]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // Custom rendering for code blocks
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
                          // Ensure links open in new tab
                          a({ node, children, ...props }: any) {
                            return (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          AI-powered by Google Gemini. Responses may not always be accurate.
        </p>
      </CardContent>
    </Card>
  );
}
