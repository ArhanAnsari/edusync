/**
 * AI Utilities for EduSync
 * Powered by Google Generative AI (Gemini) via Vercel AI SDK
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, generateObject, streamText } from 'ai';
import { z } from 'zod';

// Validate API Key is available
if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.warn(
    '⚠️  WARNING: No Gemini API key found. AI services will not work.\n' +
    'Please set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY environment variable.'
  );
}
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const google = createGoogleGenerativeAI({
  apiKey: apiKey,
});

// Get the best available model - using Gemini 2.5 as preferred
function getModel() {
  // Try to use Gemini 2.5 Flash (primary choice for balance of speed and quality)
  try {
    return google('gemini-2.5-flash');
  } catch (error) {
    // First fallback to Gemini 2.5 Pro (for more complex reasoning if Flash is unavailable)
    try {
      return google('gemini-2.5-pro');
    } catch (secondError) {
      // Second fallback to a stable model if 2.5 isn't available
      console.warn("Failed to initialize Gemini 2.5 models, falling back to older version");
      return google('gemini-2.0-flash');
    }
  }
}

// Initialize Gemini model dynamically
const model = getModel();

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
    // Validate API key before making request
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('AI service not configured. Missing API key.');
    }

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

    if (!object.questions || object.questions.length === 0) {
      throw new Error('No questions generated');
    }

    return object.questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      throw new Error('AI service authentication failed. Please check configuration.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error('AI service rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      throw new Error('AI service timeout. Please try again.');
    }
    if (errorMessage.includes('schema') || errorMessage.includes('properties')) {
      // Handle schema validation errors that might occur with Gemini 2.5
      throw new Error('Schema error with AI service. Please check the format of your request.');
    }
    if (errorMessage.includes('safety') || errorMessage.includes('block')) {
      // Handle content safety blocks
      throw new Error('Content blocked by AI safety filters. Please modify your request.');
    }
    if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      // Model availability issues
      throw new Error('Selected AI model is currently unavailable. System will try to use an alternative model.');
    }
    
    throw new Error(`Failed to generate quiz questions: ${errorMessage}`);
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
    // Validate API key
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('AI service not configured. Missing API key.');
    }

    if (!topic || topic.trim().length === 0) {
      throw new Error('Topic cannot be empty');
    }

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

    if (!object.suggestions || object.suggestions.length === 0) {
      throw new Error('No suggestions generated');
    }

    return object.suggestions;
  } catch (error) {
    console.error('Error generating assignment suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      throw new Error('AI service authentication failed. Please check configuration.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error('AI service rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      throw new Error('AI service timeout. Please try again.');
    }
    if (errorMessage.includes('schema') || errorMessage.includes('properties')) {
      throw new Error('Schema error with AI service. Please check the format of your request.');
    }
    if (errorMessage.includes('safety') || errorMessage.includes('block')) {
      throw new Error('Content blocked by AI safety filters. Please modify your request.');
    }
    if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      throw new Error('Selected AI model is currently unavailable. System will try to use an alternative model.');
    }
    if (errorMessage.includes('not configured')) {
      throw new Error(errorMessage);
    }
    
    throw new Error(`Failed to generate assignment suggestions: ${errorMessage}`);
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
    // Validate API key
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('AI service not configured. Missing API key.');
    }

    if (!assignmentPrompt || assignmentPrompt.trim().length === 0) {
      throw new Error('Assignment prompt cannot be empty');
    }
    if (!studentSubmission || studentSubmission.trim().length === 0) {
      throw new Error('Student submission cannot be empty');
    }

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

    if (!object || object.score === undefined) {
      throw new Error('Invalid grading feedback generated');
    }

    return object;
  } catch (error) {
    console.error('Error generating grading feedback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      throw new Error('AI service authentication failed. Please check configuration.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error('AI service rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      throw new Error('AI service timeout. Please try again.');
    }
    if (errorMessage.includes('schema') || errorMessage.includes('properties')) {
      throw new Error('Schema error with AI service. Please check the format of your request.');
    }
    if (errorMessage.includes('safety') || errorMessage.includes('block')) {
      throw new Error('Content blocked by AI safety filters. Please modify your request.');
    }
    if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      throw new Error('Selected AI model is currently unavailable. System will try to use an alternative model.');
    }
    if (errorMessage.includes('not configured')) {
      throw new Error(errorMessage);
    }
    
    throw new Error(`Failed to generate grading feedback: ${errorMessage}`);
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
    // Validate API key
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('AI service not configured. Missing API key.');
    }

    if (!content || content.trim().length === 0) {
      throw new Error('Content cannot be empty');
    }

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

    if (!object || !object.summary) {
      throw new Error('No summary generated');
    }

    return object;
  } catch (error) {
    console.error('Error summarizing content:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      throw new Error('AI service authentication failed. Please check configuration.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error('AI service rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      throw new Error('AI service timeout. Please try again.');
    }
    if (errorMessage.includes('schema') || errorMessage.includes('properties')) {
      throw new Error('Schema error with AI service. Please check the format of your request.');
    }
    if (errorMessage.includes('safety') || errorMessage.includes('block')) {
      throw new Error('Content blocked by AI safety filters. Please modify your request.');
    }
    if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      throw new Error('Selected AI model is currently unavailable. System will try to use an alternative model.');
    }
    if (errorMessage.includes('not configured')) {
      throw new Error(errorMessage);
    }
    
    throw new Error(`Failed to summarize content: ${errorMessage}`);
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
    // Validate API key
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('AI service not configured. Missing API key.');
    }

    if (!studentContext.currentTopics || studentContext.currentTopics.length === 0) {
      throw new Error('Current topics are required');
    }

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

    if (!object.recommendations || object.recommendations.length === 0) {
      throw new Error('No recommendations generated');
    }

    return object.recommendations;
  } catch (error) {
    console.error('Error generating study recommendations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      throw new Error('AI service authentication failed. Please check configuration.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error('AI service rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      throw new Error('AI service timeout. Please try again.');
    }
    if (errorMessage.includes('schema') || errorMessage.includes('properties')) {
      throw new Error('Schema error with AI service. Please check the format of your request.');
    }
    if (errorMessage.includes('safety') || errorMessage.includes('block')) {
      throw new Error('Content blocked by AI safety filters. Please modify your request.');
    }
    if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      throw new Error('Selected AI model is currently unavailable. System will try to use an alternative model.');
    }
    if (errorMessage.includes('not configured')) {
      throw new Error(errorMessage);
    }
    
    throw new Error(`Failed to generate study recommendations: ${errorMessage}`);
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
    // Validate API key
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('AI service not configured. Missing API key.');
    }

    if (!concept || concept.trim().length === 0) {
      throw new Error('Concept cannot be empty');
    }

    const { text } = await generateText({
      model,
      prompt: `Explain the concept of "${concept}" in a ${level} way${context ? ` in the context of ${context}` : ''}.

Requirements based on level:
- Simple: Use everyday language, analogies, and simple examples. Suitable for beginners.
- Detailed: Provide comprehensive explanation with examples, use cases, and clarifications.
- Advanced: Include technical details, edge cases, advanced applications, and theoretical foundations.

Make the explanation educational, engaging, and easy to understand for students.`,
      maxOutputTokens: 1024,
      temperature: 0.7,
    });

    if (!text || text.trim().length === 0) {
      throw new Error('AI service returned empty response');
    }

    return text;
  } catch (error) {
    console.error('Error explaining concept:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      throw new Error('AI service authentication failed. Please check configuration.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error('AI service rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      throw new Error('AI service timeout. Please try again.');
    }
    if (errorMessage.includes('empty response')) {
      throw new Error('AI service returned no response. Please try again.');
    }
    if (errorMessage.includes('safety') || errorMessage.includes('block')) {
      throw new Error('Content blocked by AI safety filters. Please modify your request.');
    }
    if (errorMessage.includes('model') || errorMessage.includes('not available')) {
      throw new Error('Selected AI model is currently unavailable. System will try to use an alternative model.');
    }
    if (errorMessage.includes('not configured')) {
      throw new Error(errorMessage);
    }
    
    throw new Error(`Failed to explain concept: ${errorMessage}`);
  }
}

// ============================================
// CHAT ASSISTANT (Streaming - Stable & Production Fixed)
// ============================================

// ---- Global AI Config ---- //
const API_KEY =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

if (!API_KEY)
  console.warn(
    "⚠️ Gemini API key missing — set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in .env"
  );

const modelName = (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim();

const MAX_RETRIES = Number(process.env.GEMINI_RETRIES) || 2;
const TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 30000;
const MAX_TOKENS = Number(process.env.GEMINI_MAX_TOKENS) || 1024;

// ---- Helper: retry wrapper with timeout ---- //
async function withRetries<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  retries = MAX_RETRIES,
  timeoutMs = TIMEOUT_MS
): Promise<T> {
  let attempt = 0;
  let lastError: any;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const result = await fn(controller.signal);
      clearTimeout(timer);
      return result;
    } catch (err: any) {
      clearTimeout(timer);
      lastError = err;
      attempt++;

      const msg = err?.message || String(err);
      const retryable =
        msg.includes("timeout") ||
        msg.includes("ECONNRESET") ||
        msg.includes("DEADLINE_EXCEEDED") ||
        msg.includes("429") ||
        /5\d{2}/.test(msg);

      if (!retryable || attempt > retries) throw err;

      const backoff = 500 * Math.pow(2, attempt);
      console.warn(`[EduSync AI] Retry #${attempt} after ${backoff}ms:`, msg);
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  throw lastError ?? new Error("AI request failed after retries");
}

// ---- Main Assistant ---- //
export async function chatWithAssistant(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemContext?: string
) {
  try {
    if (!API_KEY)
      throw new Error("AI service not configured. Missing API key.");
    if (!messages?.length)
      throw new Error("Messages array must not be empty.");

    const systemPrompt =
      systemContext ||
      `You are **EduSync AI**, a helpful learning assistant for students and teachers.

🎓 **About EduSync**
A modern LMS with:
- Interactive courses & quizzes
- AI-powered tutoring
- Assignments, analytics, & discussions

💡 **Your Role**
Be a patient mentor.  
Explain clearly, encourage curiosity, and never reveal full answers to graded content.  
Use **Markdown** and **LaTeX** for math.

⚙️ **Response Style**
- Friendly and structured  
- Use headings, bullet points, and short examples  
- Show math as $E = mc^2$  
- End with an encouraging question or summary.`;

    // ---- Execute streaming call with retries ---- //
    return await withRetries(async (signal) => {
      const stream = await streamText({
        model,
        system: systemPrompt,
        messages,
        temperature: 0.7,
        maxOutputTokens: MAX_TOKENS,
        providerOptions: {
          google: {
            thinkingConfig: { thinkingBudget: 4096, includeThoughts: false },
            safetySettings: [
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
          },
        },
        signal,
      });

      if (!stream?.toTextStreamResponse)
        throw new Error("Invalid response from Gemini AI service");

      return stream;
    });
  } catch (error: any) {
    console.error("❌ EduSync AI Chat Error:", error);

    const msg = error?.message || "Unknown AI error";

    if (msg.includes("API key") || msg.includes("401"))
      throw new Error("AI authentication failed. Check credentials.");
    if (msg.includes("429"))
      throw new Error("AI rate limit reached. Please try again later.");
    if (msg.includes("timeout"))
      throw new Error("AI service timeout. Please retry.");
    if (msg.includes("safety") || msg.includes("harmful"))
      throw new Error("Content blocked by safety filters.");
    if (msg.includes("model") || msg.includes("not available"))
      throw new Error("AI model currently unavailable.");
    if (msg.includes("budget"))
      throw new Error("Request too complex. Please simplify your question.");

    throw new Error(`AI chat failed: ${msg}`);
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
    // Validate API key before making request
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error('AI service not configured. Missing API key.');
    }

    if (!question || question.trim().length === 0) {
      throw new Error('Question cannot be empty');
    }

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
      maxOutputTokens: 1024,
      temperature: 0.7,
    });

    if (!text || text.trim().length === 0) {
      throw new Error('AI service returned empty response');
    }

    return text;
  } catch (error) {
    console.error('Error answering question:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('401')) {
      throw new Error('AI service authentication failed. Please check configuration.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      throw new Error('AI service rate limit exceeded. Please try again later.');
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('DEADLINE_EXCEEDED')) {
      throw new Error('AI service timeout. Please try again.');
    }
    if (errorMessage.includes('empty response')) {
      throw new Error('AI service returned no response. Please try again.');
    }
    if (errorMessage.includes('not configured')) {
      throw new Error(errorMessage);
    }
    
    throw new Error(`Failed to answer question: ${errorMessage}`);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if AI API key is configured
 */
export function isAIConfigured(): boolean {
  return !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

/**
 * Get AI model name
 */
export function getModelName(): string {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
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
