import { GoogleGenAI } from '@google/genai';

/**
 * Shared server-side Gemini access for every AI feature (tutor chat, study plan, quiz).
 * The key is read from GEMINI_API_KEY on the server only - it never reaches the browser.
 * Model can be changed with GEMINI_MODEL (default matches the model the quiz route already used).
 */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export class AiNotConfiguredError extends Error {
  constructor() {
    super('AI is not connected yet. Add GEMINI_API_KEY to your .env.local file and restart the server.');
    this.name = 'AiNotConfiguredError';
  }
}

let client: GoogleGenAI | null = null;
let clientKey = '';

export function getAi(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') throw new AiNotConfiguredError();
  if (!client || clientKey !== key) {
    client = new GoogleGenAI({ apiKey: key });
    clientKey = key;
  }
  return client;
}

/** Backup models tried automatically if the main one is overloaded or unavailable. */
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.7-flash,gemini-3.5-flash-lite')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

function errorStatus(err: unknown): number | undefined {
  const e = err as { status?: unknown; code?: unknown } | null;
  const n = Number(e?.status ?? e?.code);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Pull the human-readable reason out of the SDK error (it is often a JSON string). */
function errorDetail(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  try {
    const parsed = JSON.parse(raw);
    const msg = parsed?.error?.message ?? parsed?.message;
    if (typeof msg === 'string' && msg) return msg.slice(0, 220);
  } catch {
    /* not JSON */
  }
  return raw.replace(/\s+/g, ' ').slice(0, 220);
}

type GenerateParams = Parameters<GoogleGenAI['models']['generateContent']>[0];

/**
 * generateContent with automatic backup models. Only retries for "this model is
 * unavailable right now" errors (404 / 500 / 503); bad key, quota and bad requests
 * are returned immediately.
 */
export async function generate(params: Omit<GenerateParams, 'model'>) {
  const ai = getAi();
  const models = [GEMINI_MODEL, ...FALLBACK_MODELS.filter((m) => m !== GEMINI_MODEL)];
  let lastErr: unknown;
  for (const model of models) {
    try {
      return await ai.models.generateContent({ ...params, model });
    } catch (err) {
      lastErr = err;
      const status = errorStatus(err);
      const retryable = status === 404 || status === 500 || status === 503 || status === 504;
      console.error(`[ai] model ${model} failed (${status ?? 'no status'}): ${errorDetail(err)}`);
      if (!retryable) break;
    }
  }
  throw lastErr;
}

/**
 * Streaming version of generate(): yields text pieces as the AI writes them.
 * Backup models are only tried if a model fails BEFORE any text was produced.
 */
export async function* generateStream(params: Omit<GenerateParams, 'model'>): AsyncGenerator<string> {
  const ai = getAi();
  const models = [GEMINI_MODEL, ...FALLBACK_MODELS.filter((m) => m !== GEMINI_MODEL)];
  let lastErr: unknown;
  for (const model of models) {
    let started = false;
    try {
      const stream = await ai.models.generateContentStream({ ...params, model });
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          started = true;
          yield text;
        }
      }
      if (!started) throw new Error('The AI returned an empty answer. Please try again.');
      return;
    } catch (err) {
      if (started) throw err;
      lastErr = err;
      const status = errorStatus(err);
      const retryable = status === 404 || status === 500 || status === 503 || status === 504;
      console.error(`[ai] model ${model} failed (${status ?? 'no status'}): ${errorDetail(err)}`);
      if (!retryable) break;
    }
  }
  throw lastErr;
}

/** Turn any SDK/network error into a short, student-friendly message + HTTP status. */
export function describeAiError(err: unknown): { message: string; status: number } {
  if (err instanceof AiNotConfiguredError) return { message: err.message, status: 503 };
  const status = errorStatus(err);
  const detail = errorDetail(err);
  const lower = detail.toLowerCase();
  const withDetail = (text: string) => `${text} (${detail})`;

  if (status === 401 || status === 403 || lower.includes('api key') || lower.includes('permission denied')) {
    return { message: withDetail('The AI key was rejected. Please check GEMINI_API_KEY.'), status: 502 };
  }
  if (status === 429 || lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted')) {
    return { message: withDetail('AI usage limit reached for this key. Wait a minute and try again.'), status: 429 };
  }
  if (status === 503 || lower.includes('overloaded') || lower.includes('unavailable')) {
    return { message: withDetail('The AI is very busy right now. Please try again in a moment.'), status: 503 };
  }
  if (status === 404 || lower.includes('is not found')) {
    return { message: withDetail('The AI model is not available for this key. Set GEMINI_MODEL in .env.local.'), status: 502 };
  }
  if (status === 400) {
    return { message: withDetail('The AI could not accept this request.'), status: 400 };
  }
  return { message: withDetail('The AI could not answer right now.'), status: 502 };
}
