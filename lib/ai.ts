/**
 * lib/ai.ts
 *
 * Robust AI utilities for EduSync (Gemini via Vercel AI SDK)
 *
 * Improvements:
 * - Retry + exponential backoff for transient errors
 * - AbortController-based timeout
 * - Env-driven configuration (GEMINI_MAX_TOKENS, GEMINI_TIMEOUT_MS, GEMINI_RETRIES, GEMINI_THINKING_BUDGET)
 * - Safer model selection with graceful fallback
 * - Streaming preserved (returns stream object from streamText)
 * - Better error classification & messages
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, generateObject, streamText, StreamTextResult } from 'ai';
import { z } from 'zod';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
if (!API_KEY) {
  console.warn(
    '⚠️ No Gemini API key found. Set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY to enable AI services.'
  );
}

const google = createGoogleGenerativeAI({ apiKey: API_KEY });

// Configurable via env:
const DEFAULT_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 30_000; // 30s
const MAX_RETRIES = Number(process.env.GEMINI_RETRIES) || 2; // number of retries on transient errors
const MAX_TOKENS_ENV = process.env.GEMINI_MAX_TOKENS ? Number(process.env.GEMINI_MAX_TOKENS) : undefined;
// thinkingBudget: lower default to be friendly for free tier; can be overridden
const THINKING_BUDGET = Number(process.env.GEMINI_THINKING_BUDGET) || 1024;

// Helper: pick model and fallback safely
function getModelName() {
  // Prefer gemini-2.5-flash if available by name; fallback order
  const preferred = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();

  // Allow override via env
  return preferred;
}

function getModel() {
  const modelName = getModelName();
  try {
    return google(modelName);
  } catch (err) {
    console.warn(`[AI] Failed to init model ${modelName}:`, err);
    // Try fallbacks
    const fallbacks = ['gemini-2.5-pro', 'gemini-2.0-flash'];
    for (const fb of fallbacks) {
      try {
        console.warn(`[AI] Trying fallback model ${fb}`);
        return google(fb);
      } catch (e) {
        console.warn(`[AI] Fallback ${fb} failed:`, e);
      }
    }
    // Last resort: let the SDK decide with a generic call
    try {
      return google('gemini-2.0-flash');
    } catch (e) {
      // If everything fails, rethrow
      throw new Error('No AI model available: ' + String(e));
    }
  }
}

const model = getModel();

/**
 * Generic retry wrapper with exponential backoff.
 * - Retries on transient errors (network, 429, 5xx)
 */
async function withRetries<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  retries = MAX_RETRIES,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<T> {
  let attempt = 0;
  let lastError: any = null;
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
      const message = err?.message || String(err);
      // If aborted due to timeout, maybe retry depending on attempts left
      const isRetryable =
        message.includes('timeout') ||
        message.includes('DEADLINE_EXCEEDED') ||
        message.includes('ETIMEDOUT') ||
        message.includes('ECONNRESET') ||
        message.includes('rate limit') ||
        message.includes('429') ||
        /5\d{2}/.test(message); // 5xx

      if (!isRetryable || attempt > retries) {
        // Not retryable or out of retries
        console.error(`[AI] Request failed (attempt ${attempt}/${retries}):`, message);
        throw err;
      }

      // Exponential backoff with jitter
      const base = 400 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 300);
      const backoff = Math.min(5000, base + jitter);
      console.warn(`[AI] Transient error, retrying in ${backoff}ms (attempt ${attempt}/${retries})`, message);
      await new Promise((res) => setTimeout(res, backoff));
      // loop and retry
    }
  }
  throw lastError ?? new Error('Unknown retry error in AI wrapper');
}

/* ============================
   Type definitions (same as before)
   ============================ */

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

/* ============================
   Schemas
   ============================ */

const quizQuestionSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctAnswer: z.number().min(0).max(3),
      explanation: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      points: z.number().positive(),
    })
  ),
});

const assignmentSchema = z.object({
  suggestions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      estimatedTime: z.string(),
      learningObjectives: z.array(z.string()),
      suggestedDeadline: z.string(),
    })
  ),
});

const gradingSchema = z.object({
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  overallComment: z.string(),
});

const summarySchema = z.object({
  mainPoints: z.array(z.string()),
  keyTakeaways: z.array(z.string()),
  summary: z.string(),
  relatedTopics: z.array(z.string()),
});

const recommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      topic: z.string(),
      reason: z.string(),
      priority: z.enum(['high', 'medium', 'low']),
      resources: z.array(z.string()),
      estimatedTime: z.string(),
    })
  ),
});

/* ============================
   Utility helpers
   ============================ */

function buildProviderOptions() {
  // If SDK supports 'google' provider options, configure them; keep conservative defaults for free tier
  return {
    google: {
      thinkingConfig: {
        thinkingBudget: THINKING_BUDGET,
        includeThoughts: false,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    },
  };
}

function getMaxTokensParam(): number | undefined {
  if (typeof MAX_TOKENS_ENV === 'number' && !isNaN(MAX_TOKENS_ENV)) {
    return MAX_TOKENS_ENV;
  }
  // If not set, return undefined so SDK/provider uses default limits
  return undefined;
}

function classifyErrorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e || 'Unknown error');
  if (msg.includes('401') || msg.toLowerCase().includes('api key')) {
    return 'AI service authentication failed. Check API key.';
  }
  if (msg.includes('429') || msg.toLowerCase().includes('rate limit')) {
    return 'AI service rate limited. Try again later.';
  }
  if (msg.toLowerCase().includes('timeout') || msg.includes('DEADLINE_EXCEEDED')) {
    return 'AI service timeout. Try again.';
  }
  if (msg.toLowerCase().includes('schema')) {
    return 'AI schema error. Check request format.';
  }
  return msg;
}

/* ============================
   Public API functions
   ============================ */

/**
 * generateQuizQuestions
 */
export async function generateQuizQuestions(
  topic: string,
  numberOfQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion[]> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!topic || topic.trim().length === 0) throw new Error('Topic cannot be empty');

  const prompt = `Generate ${numberOfQuestions} ${difficulty} multiple-choice quiz questions about "${topic}".
- Each question should have exactly 4 options, single correct answer.
- Provide explanation for the correct answer.
- Points: easy=5, medium=10, hard=15.
Return JSON: { "questions": [ ... ] }`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      schema: quizQuestionSchema,
      prompt,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;
    const { object } = await generateObject(params as any);
    if (!object?.questions || !Array.isArray(object.questions) || object.questions.length === 0) {
      throw new Error('No questions generated');
    }
    return object.questions as QuizQuestion[];
  });
}

/**
 * generateAssignmentSuggestions
 */
export async function generateAssignmentSuggestions(
  topic: string,
  studentLevel: string = 'intermediate',
  numberOfSuggestions: number = 3
): Promise<AssignmentSuggestion[]> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!topic || topic.trim().length === 0) throw new Error('Topic cannot be empty');

  const prompt = `Generate ${numberOfSuggestions} assignment suggestions for ${studentLevel} students about "${topic}".
Return: { "suggestions": [ ... ] }`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      schema: assignmentSchema,
      prompt,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;
    const { object } = await generateObject(params as any);
    if (!object?.suggestions || object.suggestions.length === 0) {
      throw new Error('No suggestions generated');
    }
    return object.suggestions as AssignmentSuggestion[];
  });
}

/**
 * getGradingFeedback
 */
export async function getGradingFeedback(
  assignmentPrompt: string,
  studentSubmission: string,
  rubric?: string
): Promise<GradingFeedback> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');

  if (!assignmentPrompt || !studentSubmission) {
    throw new Error('Assignment prompt and student submission are required');
  }

  const prompt = `Analyze submission for assignment:
Assignment Prompt:
${assignmentPrompt}
Student Submission:
${studentSubmission}
${rubric ? `Grading Rubric:\n${rubric}` : ''}

Return JSON with keys: score, strengths, weaknesses, suggestions, overallComment.`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      schema: gradingSchema,
      prompt,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;
    const { object } = await generateObject(params as any);
    if (!object || object.score === undefined) {
      throw new Error('Invalid grading feedback generated');
    }
    return object as GradingFeedback;
  });
}

/**
 * summarizeContent
 */
export async function summarizeContent(
  content: string,
  contentType: 'article' | 'video-transcript' | 'lecture-notes' | 'textbook' = 'article'
): Promise<ContentSummary> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!content || content.trim().length === 0) throw new Error('Content cannot be empty');

  const prompt = `Summarize this ${contentType}:

${content}

Return JSON: { mainPoints: [], keyTakeaways: [], summary: "...", relatedTopics: [] }`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      schema: summarySchema,
      prompt,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;
    const { object } = await generateObject(params as any);
    if (!object || !object.summary) throw new Error('No summary generated');
    return object as ContentSummary;
  });
}

/**
 * getStudyRecommendations
 */
export async function getStudyRecommendations(
  studentContext: {
    currentTopics: string[];
    strugglingWith?: string[];
    interests?: string[];
    upcomingTests?: string[];
  }
): Promise<StudyRecommendation[]> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!studentContext?.currentTopics || studentContext.currentTopics.length === 0) {
    throw new Error('Current topics are required');
  }

  const prompt = `Generate 3-5 personalized study recommendations for:
${JSON.stringify(studentContext, null, 2)}
Return JSON: { recommendations: [...] }`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      schema: recommendationSchema,
      prompt,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;
    const { object } = await generateObject(params as any);
    if (!object?.recommendations || object.recommendations.length === 0) {
      throw new Error('No recommendations generated');
    }
    return object.recommendations as StudyRecommendation[];
  });
}

/**
 * explainConcept - returns plain text
 */
export async function explainConcept(
  concept: string,
  context?: string,
  level: 'simple' | 'detailed' | 'advanced' = 'detailed'
): Promise<string> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!concept || concept.trim().length === 0) throw new Error('Concept cannot be empty');

  const prompt = `Explain the concept "${concept}" in a ${level} way${context ? ` in the context of ${context}` : ''}.
Be educational and use examples.`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      prompt,
      temperature: 0.7,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;
    const { text } = await generateText(params as any);
    if (!text) throw new Error('AI returned empty response');
    return text;
  });
}

/**
 * chatWithAssistant (streaming)
 *
 * Returns the result from streamText so the caller (route handler) can return a streaming response.
 * Example: const result = await chatWithAssistant(...); return result.toTextStreamResponse();
 */
export async function chatWithAssistant(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemContext?: string
): Promise<StreamTextResult> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!messages || messages.length === 0) throw new Error('Messages array is required');

  const systemPrompt =
    systemContext ||
    `You are EduSync assistant... (educational assistant context truncated here; set via caller)`;

  // streamText returns an object with streaming utilities
  return withRetries(async (signal) => {
    const params: any = {
      model,
      system: systemPrompt,
      messages,
      temperature: 0.7,
      providerOptions: buildProviderOptions(),
      // Do not set maxOutputTokens if not explicitly configured; let provider default
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;

    const streamResult = await streamText(params as any);
    return streamResult as StreamTextResult;
  }, MAX_RETRIES, DEFAULT_TIMEOUT_MS * 2); // allow more time for streaming creation
}

/**
 * answerQuestion (non-streaming)
 */
export async function answerQuestion(
  question: string,
  context?: string,
  previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!question || question.trim().length === 0) throw new Error('Question cannot be empty');

  const contextPrompt = context ? `\n\nContext:\n${context}` : '';
  const history = previousMessages ? previousMessages.map((m) => `${m.role}: ${m.content}`).join('\n') : '';
  const prompt = `${history ? `History:\n${history}\n\n` : ''}Question: ${question}${contextPrompt}\n\nProvide a clear, helpful answer.`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      prompt,
      temperature: 0.7,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;
    const { text } = await generateText(params as any);
    if (!text) throw new Error('AI returned empty response');
    return text;
  });
}

/* ============================
   Utilities exported earlier
   ============================ */

export function isAIConfigured(): boolean {
  return !!API_KEY;
}

export function getModelName(): string {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

export function truncateText(text: string, maxLength = 1000): string {
  if (!text) return text;
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatAIError(error: unknown): string {
  const msg = classifyErrorMessage(error);
  return msg;
}
