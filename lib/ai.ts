/**
 * lib/ai.ts
 *
 * Robust AI utilities for EduSync (Gemini via Vercel AI SDK)
 *
 * - Single exported getModelName()
 * - Retry + exponential backoff + timeout
 * - Configurable env-driven options (max tokens, timeouts, retries, thinkingBudget)
 * - Safer model fallback
 * - Streaming preserved (returns the StreamTextResult)
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, generateObject, streamText, StreamTextResult } from 'ai';
import { z } from 'zod';

// ---------------------------
// Environment / config
// ---------------------------
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
if (!API_KEY) {
  console.warn('⚠️ No Gemini API key found. Set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.');
}

const google = createGoogleGenerativeAI({ apiKey: API_KEY });

// Defaults (override with env)
const DEFAULT_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 30_000;
const MAX_RETRIES = Number(process.env.GEMINI_RETRIES) || 2;
const MAX_TOKENS_ENV = process.env.GEMINI_MAX_TOKENS ? Number(process.env.GEMINI_MAX_TOKENS) : undefined;
const THINKING_BUDGET = Number(process.env.GEMINI_THINKING_BUDGET) || 1024;

// ---------------------------
// Model selection
// ---------------------------
export function getModelName(): string {
  return (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
}

function getModel() {
  const modelName = getModelName();
  try {
    return google(modelName);
  } catch (err) {
    console.warn(`[AI] Failed to init model ${modelName}:`, err);
    const fallbacks = ['gemini-2.5-pro', 'gemini-2.0-flash'];
    for (const fb of fallbacks) {
      try {
        console.warn(`[AI] Trying fallback model ${fb}`);
        return google(fb);
      } catch (e) {
        console.warn(`[AI] Fallback ${fb} failed:`, e);
      }
    }
    // final attempt
    try {
      return google('gemini-2.0-flash');
    } catch (e) {
      throw new Error('No AI model available: ' + String(e));
    }
  }
}

const model = getModel();

// ---------------------------
// Retry wrapper + timeout
// ---------------------------
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
      const msg = err?.message || String(err || '');
      const isRetryable =
        msg.toLowerCase().includes('timeout') ||
        msg.includes('DEADLINE_EXCEEDED') ||
        msg.includes('ETIMEDOUT') ||
        msg.includes('ECONNRESET') ||
        msg.includes('429') ||
        msg.toLowerCase().includes('rate limit') ||
        /5\d{2}/.test(msg);

      if (!isRetryable || attempt > retries) {
        console.error(`[AI] Request failed (attempt ${attempt}/${retries}):`, msg);
        throw err;
      }

      const base = 400 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 300);
      const backoff = Math.min(5000, base + jitter);
      console.warn(`[AI] Transient error, retrying in ${backoff}ms (attempt ${attempt}/${retries})`, msg);
      await new Promise((res) => setTimeout(res, backoff));
    }
  }
  throw lastError ?? new Error('Unknown retry error in AI wrapper');
}

// ---------------------------
// Types & schemas
// ---------------------------
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

// ---------------------------
// Helpers
// ---------------------------
function buildProviderOptions() {
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
  if (typeof MAX_TOKENS_ENV === 'number' && !isNaN(MAX_TOKENS_ENV)) return MAX_TOKENS_ENV;
  return undefined; // let provider default
}

function classifyErrorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e || 'Unknown error');
  if (msg.includes('401') || msg.toLowerCase().includes('api key')) return 'AI service authentication failed. Check API key.';
  if (msg.includes('429') || msg.toLowerCase().includes('rate limit')) return 'AI service rate limited. Try again later.';
  if (msg.toLowerCase().includes('timeout') || msg.includes('DEADLINE_EXCEEDED')) return 'AI service timeout. Try again.';
  if (msg.toLowerCase().includes('schema')) return 'AI schema error. Check request format.';
  return msg;
}

// ---------------------------
// Public API functions
// ---------------------------

export async function generateQuizQuestions(
  topic: string,
  numberOfQuestions: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<QuizQuestion[]> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!topic || topic.trim().length === 0) throw new Error('Topic cannot be empty');

  const prompt = `Generate ${numberOfQuestions} ${difficulty} multiple-choice quiz questions about "${topic}".
- Exactly 4 options
- Single correct answer
- Short explanation
- Return JSON: { "questions": [ ... ] }`;

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

export async function generateAssignmentSuggestions(
  topic: string,
  studentLevel: string = 'intermediate',
  numberOfSuggestions: number = 3
): Promise<AssignmentSuggestion[]> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!topic || topic.trim().length === 0) throw new Error('Topic cannot be empty');

  const prompt = `Generate ${numberOfSuggestions} assignment suggestions for ${studentLevel} students about "${topic}".
Return JSON: { "suggestions": [ ... ] }`;

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
    if (!object?.suggestions || object.suggestions.length === 0) throw new Error('No suggestions generated');
    return object.suggestions as AssignmentSuggestion[];
  });
}

export async function getGradingFeedback(
  assignmentPrompt: string,
  studentSubmission: string,
  rubric?: string
): Promise<GradingFeedback> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!assignmentPrompt || !studentSubmission) throw new Error('Assignment prompt and submission are required');

  const prompt = `Analyze this student submission and provide grading feedback.\n\nAssignment Prompt:\n${assignmentPrompt}\n\nStudent Submission:\n${studentSubmission}\n${rubric ? `\nRubric:\n${rubric}` : ''}\n\nReturn JSON.`;

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
    if (!object || object.score === undefined) throw new Error('Invalid grading feedback generated');
    return object as GradingFeedback;
  });
}

export async function summarizeContent(content: string, contentType: 'article' | 'video-transcript' | 'lecture-notes' | 'textbook' = 'article'): Promise<ContentSummary> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!content || content.trim().length === 0) throw new Error('Content cannot be empty');

  const prompt = `Summarize this ${contentType} for a student. Content:\n${content}\nReturn JSON.`;

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

export async function getStudyRecommendations(studentContext: { currentTopics: string[]; strugglingWith?: string[]; interests?: string[]; upcomingTests?: string[]; }): Promise<StudyRecommendation[]> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!studentContext?.currentTopics || studentContext.currentTopics.length === 0) throw new Error('Current topics are required');

  const prompt = `Generate personalized study recommendations for:\n${JSON.stringify(studentContext, null, 2)}\nReturn JSON: { recommendations: [...] }`;

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
    if (!object?.recommendations || object.recommendations.length === 0) throw new Error('No recommendations generated');
    return object.recommendations as StudyRecommendation[];
  });
}

export async function explainConcept(concept: string, context?: string, level: 'simple' | 'detailed' | 'advanced' = 'detailed'): Promise<string> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!concept || concept.trim().length === 0) throw new Error('Concept cannot be empty');

  const prompt = `Explain the concept "${concept}" in a ${level} way${context ? ` in the context of ${context}` : ''}. Use simple examples.`;

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
 * Returns StreamTextResult which the route can convert to a streaming Response
 */
export async function chatWithAssistant(messages: Array<{ role: 'user' | 'assistant'; content: string }>, systemContext?: string): Promise<StreamTextResult> {
  if (!API_KEY) throw new Error('AI service not configured (missing API key).');
  if (!messages || messages.length === 0) throw new Error('Messages array is required');

  const systemPrompt = systemContext || `You are EduSync assistant — a friendly educational assistant. Be concise, explain concepts, provide study help.`;

  return withRetries(async (signal) => {
    const params: any = {
      model,
      system: systemPrompt,
      messages,
      temperature: 0.7,
      providerOptions: buildProviderOptions(),
    };
    const maxTokens = getMaxTokensParam();
    if (maxTokens) params.maxOutputTokens = maxTokens;

    const streamResult = await streamText(params as any);
    return streamResult as StreamTextResult;
  }, MAX_RETRIES, DEFAULT_TIMEOUT_MS * 2);
}

// ---------------------------
// Utilities
// ---------------------------
export function isAIConfigured(): boolean {
  return !!API_KEY;
}

export function truncateText(text: string, maxLength = 1000): string {
  if (!text) return text;
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...';
}

export function formatAIError(error: unknown): string {
  return classifyErrorMessage(error);
}
