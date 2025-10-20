/**
 * AI Utilities for EduSync
 * Powered by Google Generative AI (Gemini) via Vercel AI SDK
 */

import { google } from '@ai-sdk/google';
import { generateText, generateObject, streamText } from 'ai';
import { z } from 'zod';

// Initialize Gemini model
const model = google('gemini-2.5-pro');

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface AssignmentSuggestion {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  learningObjectives: string[];
  suggestedDeadline: string;
}

export interface GradingFeedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  overallComment: string;
}

export interface ContentSummary {
  mainPoints: string[];
  keyTakeaways: string[];
  summary: string;
  relatedTopics: string[];
}

export interface StudyRecommendation {
  topic: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  resources: string[];
  estimatedTime: string;
}

// ============================================
// QUIZ GENERATION
// ============================================

const quizQuestionSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string().describe('The quiz question text'),
      options: z.array(z.string()).length(4).describe('Four answer options'),
      correctAnswer: z.number().min(0).max(3).describe('Index of correct answer (0-3)'),
      explanation: z.string().describe('Explanation of the correct answer'),
      difficulty: z.enum(['easy', 'medium', 'hard']).describe('Question difficulty level'),
      points: z.number().positive().describe('Points awarded for correct answer'),
    })
  ),
});

export async function generateQuizQuestions(
  topic: string,
  numberOfQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion[]> {
  try {
    const { object } = await generateObject({
      model,
      schema: quizQuestionSchema,
      prompt: `Generate ${numberOfQuestions} ${difficulty} multiple-choice quiz questions about "${topic}".
      
Requirements:
- Each question should test understanding of the topic
- Provide exactly 4 answer options for each question
- Only one answer should be correct
- Include a clear explanation for the correct answer
- Assign points based on difficulty: easy (5), medium (10), hard (15)
- Make questions educational and relevant
- Avoid trick questions or ambiguous wording

Format the response as a structured JSON object with an array of questions.`,
    });

    return object.questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions. Please try again.');
  }
}

// ============================================
// ASSIGNMENT SUGGESTIONS
// ============================================

const assignmentSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string().describe('Assignment title'),
      description: z.string().describe('Detailed assignment description'),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe('Difficulty level'),
      estimatedTime: z.string().describe('Estimated completion time'),
      learningObjectives: z.array(z.string()).describe('What students will learn'),
      suggestedDeadline: z.string().describe('Recommended deadline'),
    })
  ),
});

export async function generateAssignmentSuggestions(
  topic: string,
  studentLevel: string = 'intermediate',
  numberOfSuggestions: number = 3
): Promise<AssignmentSuggestion[]> {
  try {
    const { object } = await generateObject({
      model,
      schema: assignmentSchema,
      prompt: `Generate ${numberOfSuggestions} assignment suggestions for ${studentLevel} level students learning about "${topic}".
      
Requirements:
- Create practical, hands-on assignments
- Include clear learning objectives
- Provide detailed descriptions
- Suggest realistic completion times
- Make assignments progressive in difficulty
- Include real-world applications where possible

Format the response as a structured JSON object with an array of assignment suggestions.`,
    });

    return object.suggestions;
  } catch (error) {
    console.error('Error generating assignment suggestions:', error);
    throw new Error('Failed to generate assignment suggestions. Please try again.');
  }
}

// ============================================
// GRADING ASSISTANCE
// ============================================

const gradingSchema = z.object({
  score: z.number().min(0).max(100).describe('Suggested score out of 100'),
  strengths: z.array(z.string()).describe('Strong points in the submission'),
  weaknesses: z.array(z.string()).describe('Areas needing improvement'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improvement'),
  overallComment: z.string().describe('Overall constructive feedback'),
});

export async function getGradingFeedback(
  assignmentPrompt: string,
  studentSubmission: string,
  rubric?: string
): Promise<GradingFeedback> {
  try {
    const { object } = await generateObject({
      model,
      schema: gradingSchema,
      prompt: `Analyze this student submission and provide detailed grading feedback.

Assignment Prompt:
${assignmentPrompt}

Student Submission:
${studentSubmission}

${rubric ? `Grading Rubric:\n${rubric}` : ''}

Requirements:
- Provide a fair and constructive evaluation
- Identify 3-5 strengths in the work
- Identify 2-4 areas for improvement
- Give specific, actionable suggestions
- Write an encouraging overall comment
- Suggest a score out of 100

Be supportive and educational in your feedback. Focus on helping the student learn and improve.`,
    });

    return object;
  } catch (error) {
    console.error('Error generating grading feedback:', error);
    throw new Error('Failed to generate grading feedback. Please try again.');
  }
}

// ============================================
// CONTENT SUMMARIZATION
// ============================================

const summarySchema = z.object({
  mainPoints: z.array(z.string()).describe('Main points from the content'),
  keyTakeaways: z.array(z.string()).describe('Key takeaways and learnings'),
  summary: z.string().describe('Concise summary of the content'),
  relatedTopics: z.array(z.string()).describe('Related topics to explore'),
});

export async function summarizeContent(
  content: string,
  contentType: 'article' | 'video-transcript' | 'lecture-notes' | 'textbook' = 'article'
): Promise<ContentSummary> {
  try {
    const { object } = await generateObject({
      model,
      schema: summarySchema,
      prompt: `Summarize this ${contentType} for a student.

Content:
${content}

Requirements:
- Extract 4-6 main points
- Identify 3-5 key takeaways
- Write a concise 2-3 sentence summary
- Suggest 3-4 related topics to explore
- Make it educational and easy to understand

Focus on what's most important for learning and retention.`,
    });

    return object;
  } catch (error) {
    console.error('Error summarizing content:', error);
    throw new Error('Failed to summarize content. Please try again.');
  }
}

// ============================================
// STUDY RECOMMENDATIONS
// ============================================

const recommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      topic: z.string().describe('Recommended topic to study'),
      reason: z.string().describe('Why this topic is recommended'),
      priority: z.enum(['high', 'medium', 'low']).describe('Priority level'),
      resources: z.array(z.string()).describe('Suggested resources or approaches'),
      estimatedTime: z.string().describe('Estimated study time needed'),
    })
  ),
});

export async function getStudyRecommendations(
  studentContext: {
    currentTopics: string[];
    strugglingWith?: string[];
    interests?: string[];
    upcomingTests?: string[];
  }
): Promise<StudyRecommendation[]> {
  try {
    const { object } = await generateObject({
      model,
      schema: recommendationSchema,
      prompt: `Generate personalized study recommendations for a student.

Student Context:
- Current Topics: ${studentContext.currentTopics.join(', ')}
${studentContext.strugglingWith ? `- Struggling With: ${studentContext.strugglingWith.join(', ')}` : ''}
${studentContext.interests ? `- Interests: ${studentContext.interests.join(', ')}` : ''}
${studentContext.upcomingTests ? `- Upcoming Tests: ${studentContext.upcomingTests.join(', ')}` : ''}

Requirements:
- Provide 3-5 specific study recommendations
- Prioritize based on upcoming tests and struggles
- Include practical study resources and approaches
- Suggest realistic time commitments
- Make recommendations actionable and specific

Focus on helping the student succeed and stay motivated.`,
    });

    return object.recommendations;
  } catch (error) {
    console.error('Error generating study recommendations:', error);
    throw new Error('Failed to generate study recommendations. Please try again.');
  }
}

// ============================================
// CONCEPT EXPLANATION
// ============================================

export async function explainConcept(
  concept: string,
  context?: string,
  level: 'simple' | 'detailed' | 'advanced' = 'detailed'
): Promise<string> {
  try {
    const { text } = await generateText({
      model,
      prompt: `Explain the concept of "${concept}" in a ${level} way${context ? ` in the context of ${context}` : ''}.

Requirements based on level:
- Simple: Use everyday language, analogies, and simple examples. Suitable for beginners.
- Detailed: Provide comprehensive explanation with examples, use cases, and clarifications.
- Advanced: Include technical details, edge cases, advanced applications, and theoretical foundations.

Make the explanation educational, engaging, and easy to understand for students.`,
    });

    return text;
  } catch (error) {
    console.error('Error explaining concept:', error);
    throw new Error('Failed to explain concept. Please try again.');
  }
}

// ============================================
// CHAT ASSISTANT (Streaming)
// ============================================

export async function chatWithAssistant(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemContext?: string
) {
  try {
    const systemPrompt = systemContext || `You are an intelligent educational assistant for **EduSync** - a modern, comprehensive Learning Management System (LMS).

🎓 **About EduSync:**
EduSync is a cutting-edge educational platform that provides:
- **Interactive Courses**: Browse and enroll in diverse courses across multiple subjects
- **AI-Powered Learning**: Get instant help with homework, explanations, and study tips
- **Smart Quizzes**: Take adaptive quizzes with instant feedback and progress tracking
- **Live Classes**: Join virtual classrooms with video conferencing and real-time collaboration
- **Discussion Forums**: Engage with peers and instructors in topic-based discussions
- **Progress Analytics**: Track your learning journey with detailed insights and performance metrics
- **Assignment Management**: Submit, track, and receive feedback on assignments
- **Resource Library**: Access study materials, notes, videos, and supplementary content
- **Certificate Programs**: Earn verifiable certificates upon course completion
- **Mobile-Friendly**: Learn anywhere with responsive design and offline support

📚 **Key Features You Can Help With:**
1. **Course Navigation**: Help users find courses, understand syllabi, and track progress
2. **Quiz Assistance**: Explain quiz questions, provide hints (not direct answers), and study strategies
3. **Homework Help**: Break down complex problems, teach problem-solving approaches
4. **Study Planning**: Create personalized study schedules and time management tips
5. **Concept Clarification**: Explain topics in simple terms using analogies and examples
6. **Exam Preparation**: Provide revision strategies, practice problems, and confidence tips
7. **Discussion Support**: Help formulate questions and engage in academic discussions
8. **Resource Recommendations**: Suggest relevant study materials and learning paths

🎯 **Your Role:**
- Be a friendly, patient, and encouraging learning companion
- Help students **understand** concepts, don't just give answers
- Break down complex topics into digestible explanations
- Use **LaTeX** for math equations: $x^2$ for inline, $$\\frac{a}{b}$$ for display
- Use **Markdown** for formatting: **bold**, *italic*, lists, tables, code blocks
- Ask clarifying questions when needed
- Promote critical thinking and active learning
- Stay educational and avoid off-topic conversations
- Provide examples and analogies to aid understanding
- Encourage students and celebrate their progress

💡 **Response Guidelines:**
- Start with a friendly greeting for first messages
- Use emojis sparingly to keep responses engaging
- Format math beautifully with LaTeX notation
- Structure responses with headings, lists, and sections
- Include "Try this" suggestions for practice
- End with encouraging words or follow-up questions
- Keep responses concise but thorough

🔧 **Platform Technical Details:**
- Built with Next.js 15, React 19, TypeScript
- Integrates Appwrite for backend (auth, database, storage)
- Uses Google Gemini AI for intelligent assistance
- Supports real-time updates and streaming responses
- Implements secure authentication with role-based access
- Mobile-responsive with dark mode support

Remember: You're not just answering questions - you're helping students become better learners! 🚀`;

    return await streamText({
      model,
      system: systemPrompt,
      messages,
    });
  } catch (error) {
    console.error('Error in chat assistant:', error);
    throw new Error('Failed to process chat message. Please try again.');
  }
}

// ============================================
// QUESTION ANSWERING
// ============================================

export async function answerQuestion(
  question: string,
  context?: string,
  previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  try {
    const contextPrompt = context
      ? `\n\nContext/Reference Material:\n${context}`
      : '';

    const conversationHistory = previousMessages
      ? previousMessages.map((msg) => `${msg.role}: ${msg.content}`).join('\n')
      : '';

    const { text } = await generateText({
      model,
      prompt: `${conversationHistory ? `Previous Conversation:\n${conversationHistory}\n\n` : ''}Question: ${question}${contextPrompt}

Provide a clear, accurate, and educational answer to this question. 

Requirements:
- Give a direct answer to the question
- Explain the reasoning or concept behind it
- Include examples if helpful
- Be concise but thorough
- Use student-friendly language
- Encourage further learning

If the question is unclear, ask for clarification. If you need more context, say so.`,
    });

    return text;
  } catch (error) {
    console.error('Error answering question:', error);
    throw new Error('Failed to answer question. Please try again.');
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if AI API key is configured
 */
export function isAIConfigured(): boolean {
  return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
}

/**
 * Get AI model name
 */
export function getModelName(): string {
  return process.env.GEMINI_MODEL || 'gemini-1.5-flash';
}

/**
 * Validate AI response length
 */
export function truncateText(text: string, maxLength: number = 1000): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Format AI error for user display
 */
export function formatAIError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('API key')) {
      return 'AI service not configured. Please contact your administrator.';
    }
    if (error.message.includes('rate limit')) {
      return 'AI service is busy. Please try again in a moment.';
    }
    if (error.message.includes('quota')) {
      return 'AI service quota exceeded. Please try again later.';
    }
    return error.message;
  }
  return 'An unexpected error occurred with the AI service.';
}
