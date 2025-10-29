/**
 * lib/ai.ts
 * Robust AI utilities for EduSync (Gemini via Vercel AI SDK)
 */

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, generateObject, streamText, StreamTextResult } from 'ai';
import { z } from 'zod';

// =======================================================
// ⚙️ Environment Setup
// =======================================================

const API_KEY =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
if (!API_KEY) {
  console.warn(
    '⚠️ No Gemini API key found. Set GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY.'
  );
}

const google = createGoogleGenerativeAI({ apiKey: API_KEY });

const DEFAULT_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 30000;
const MAX_RETRIES = Number(process.env.GEMINI_RETRIES) || 2;
const MAX_TOKENS_ENV = process.env.GEMINI_MAX_TOKENS
  ? Number(process.env.GEMINI_MAX_TOKENS)
  : undefined;
const THINKING_BUDGET = Number(process.env.GEMINI_THINKING_BUDGET) || 512;

// =======================================================
// 🧠 Model Selection
// =======================================================

function getModelName() {
  return (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
}

function getModel() {
  const modelName = getModelName();
  try {
    return google(modelName);
  } catch (err) {
    console.warn(`[AI] Failed to init ${modelName}:`, err);
    const fallbacks = ['gemini-2.5-pro', 'gemini-2.0-flash'];
    for (const fb of fallbacks) {
      try {
        console.warn(`[AI] Trying fallback ${fb}`);
        return google(fb);
      } catch (e) {
        console.warn(`[AI] Fallback ${fb} failed:`, e);
      }
    }
    throw new Error('No Gemini model available.');
  }
}

const model = getModel();

// =======================================================
// 🔁 Retry + Timeout Wrapper
// =======================================================

async function withRetries<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  retries = MAX_RETRIES,
  timeoutMs = DEFAULT_TIMEOUT_MS
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
        msg.includes('timeout') ||
        msg.includes('DEADLINE_EXCEEDED') ||
        msg.includes('429') ||
        msg.includes('ECONNRESET') ||
        msg.includes('rate limit');
      if (!retryable || attempt > retries) throw err;

      const delay = Math.min(5000, 400 * 2 ** attempt + Math.random() * 300);
      console.warn(`[AI] Retry #${attempt} in ${delay}ms`, msg);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastError ?? new Error('Unknown retry error');
}

// =======================================================
// 🧩 Schemas
// =======================================================

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

// =======================================================
// 🧰 Helper Functions
// =======================================================

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

function getMaxTokens() {
  return isNaN(MAX_TOKENS_ENV ?? NaN) ? undefined : MAX_TOKENS_ENV;
}

function classifyError(e: any): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes('401')) return 'AI authentication failed.';
  if (msg.includes('429')) return 'AI rate-limited. Try again.';
  if (msg.includes('timeout')) return 'AI timeout. Try again.';
  return msg;
}

// =======================================================
// 🧠 Core AI Functions
// =======================================================

export async function generateQuizQuestions(
  topic: string,
  number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
) {
  const prompt = `Generate ${number} ${difficulty} multiple-choice questions about "${topic}".
Include 4 options, 1 correct answer, and short explanations.`;
  return withRetries(async (signal) => {
    const { object } = await generateObject({
      model,
      schema: quizQuestionSchema,
      prompt,
      providerOptions: buildProviderOptions(),
      maxOutputTokens: getMaxTokens(),
    });
    return object.questions;
  });
}

export async function generateAssignmentSuggestions(topic: string, level = 'intermediate') {
  const prompt = `Generate 3 project-style assignment ideas for ${level} students about "${topic}".`;
  return withRetries(async () => {
    const { object } = await generateObject({
      model,
      schema: assignmentSchema,
      prompt,
      providerOptions: buildProviderOptions(),
      maxOutputTokens: getMaxTokens(),
    });
    return object.suggestions;
  });
}

export async function getGradingFeedback(promptText: string, submission: string) {
  const prompt = `Grade this submission fairly:\n\nPrompt:\n${promptText}\n\nSubmission:\n${submission}`;
  return withRetries(async () => {
    const { object } = await generateObject({
      model,
      schema: gradingSchema,
      prompt,
      providerOptions: buildProviderOptions(),
      maxOutputTokens: getMaxTokens(),
    });
    return object;
  });
}

export async function summarizeContent(content: string, type = 'article') {
  const prompt = `Summarize this ${type}:\n${content}`;
  return withRetries(async () => {
    const { object } = await generateObject({
      model,
      schema: summarySchema,
      prompt,
      providerOptions: buildProviderOptions(),
      maxOutputTokens: getMaxTokens(),
    });
    return object;
  });
}

export async function explainConcept(concept: string) {
  const prompt = `Explain the concept "${concept}" clearly with examples.`;
  return withRetries(async () => {
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      providerOptions: buildProviderOptions(),
      maxOutputTokens: getMaxTokens(),
    });
    return text;
  });
}

// =======================================================
// 💬 Chat Assistant (Streaming)
// =======================================================

export async function chatWithAssistant(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemContext?: string
): Promise<StreamTextResult> {
  const systemPrompt =
    systemContext ||
    `You are **EduSync AI Assistant**, a friendly educational AI helping students and teachers.  
You can assist with:
- Explaining topics clearly
- Summarizing notes
- Generating quizzes or assignments
- Providing study plans
- Offering grading feedback politely
Keep tone encouraging, structured, and concise.`;

  return withRetries(async () => {
    return await streamText({
      model,
      system: systemPrompt,
      messages,
      temperature: 0.7,
      providerOptions: buildProviderOptions(),
      maxOutputTokens: getMaxTokens(),
    });
  });
}

// =======================================================
// 🧾 Utilities
// =======================================================

export function isAIConfigured() {
  return !!API_KEY;
}

export { getModelName }; // export only once

export function truncateText(text: string, maxLength = 1000) {
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}

export function formatAIError(e: unknown) {
  return classifyError(e);
}
