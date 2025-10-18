/**
 * AI Assistant Card Component
 * Compact AI feature card for dashboards
 * 
 * NOTE: For the floating AI chat assistant, use:
 * import AISmartAssistant from '@/components/AISmartAssistant'
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle, FileQuestion, BookOpen, GraduationCap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AIFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  action: () => void;
  badge?: string;
}

interface AIAssistantCardProps {
  features: AIFeature[];
  title?: string;
  description?: string;
}

export function AIAssistantCard({
  features,
  title = 'AI-Powered Features',
  description = 'Enhance your learning with AI assistance',
}: AIAssistantCardProps) {
  return (
    <Card className="border-purple-200 dark:border-purple-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4"
                onClick={feature.action}
              >
                <div className="flex items-start gap-3 w-full">
                  <Icon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{feature.title}</span>
                      {feature.badge && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-built feature sets for common use cases
export const teacherAIFeatures: (onAction: (type: string) => void) => AIFeature[] = (
  onAction
) => [
  {
    icon: FileQuestion,
    title: 'Generate Quiz Questions',
    description: 'Create quiz questions automatically from any topic',
    action: () => onAction('quiz'),
    badge: 'New',
  },
  {
    icon: BookOpen,
    title: 'Assignment Suggestions',
    description: 'Get AI-powered assignment ideas and prompts',
    action: () => onAction('assignment'),
  },
  {
    icon: GraduationCap,
    title: 'Grading Assistant',
    description: 'Get detailed feedback suggestions for student work',
    action: () => onAction('grading'),
  },
  {
    icon: MessageCircle,
    title: 'AI Assistant',
    description: 'Chat with AI for teaching tips and resources',
    action: () => onAction('chat'),
  },
];

export const studentAIFeatures: (onAction: (type: string) => void) => AIFeature[] = (
  onAction
) => [
  {
    icon: MessageCircle,
    title: 'Study Assistant',
    description: 'Get help understanding concepts and solving problems',
    action: () => onAction('chat'),
    badge: 'Popular',
  },
  {
    icon: BookOpen,
    title: 'Summarize Content',
    description: 'Get key points and summaries of study materials',
    action: () => onAction('summarize'),
  },
  {
    icon: FileQuestion,
    title: 'Ask Questions',
    description: 'Get quick answers to your study questions',
    action: () => onAction('question'),
  },
  {
    icon: GraduationCap,
    title: 'Study Recommendations',
    description: 'Personalized study plan based on your progress',
    action: () => onAction('recommendations'),
  },
];
