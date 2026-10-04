import { NextRequest, NextResponse } from 'next/server';
import { describeAiError, generateStream } from '@/lib/ai/gemini';
import { checkAiRateLimit, getClientKey } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM_INSTRUCTION = `You are "AI Study Buddy", a warm, patient tutor who helps school students understand things easily - the way a really good teacher or ChatGPT would explain it in a conversation.

How to answer:
- Talk naturally, like a friendly teacher chatting with the student. Get straight to the answer; don't open with filler like "Great question!".
- Explain in simple words and flowing paragraphs. Use everyday examples and analogies so it truly clicks.
- Match the length to the question: a simple question gets a short, clear answer; a hard topic gets a fuller explanation.
- For maths and problem solving, show the working clearly, one line at a time, and state the final answer clearly. Explain WHY each move is made, not only what it is.
- Use formatting only when it genuinely helps readability: **bold** for key terms, short bullet or numbered lists for real lists or sequences, a small table only for comparisons, code blocks for code. Do not force headings, "Step 1/Step 2" templates, or a "key takeaway" box on every answer.
- Be accurate. If you are not sure, say so instead of guessing. Never invent facts.
- Write maths in plain text/Unicode (x², √, ×, ÷, ½, π). Never use LaTeX or $ signs.
- Reply in the same language the student writes in (English, Urdu, Roman Urdu, etc.). If they mix languages, mix naturally the same way.
- Be encouraging but not over-the-top. If it fits, end with a short, natural follow-up (for example offering a quick example or checking understanding) - but only when useful, not every time.
- If the student asks for a quiz, ask the questions and wait for their answers; when they reply, check them and explain mistakes kindly.
- If an image is attached, read it carefully and answer based on it.`;

interface IncomingMessage {
  sender: 'user' | 'ai';
  text: string;
  steps?: string[];
}
interface Attachment {
  mimeType: string;
  data: string; // base64 without prefix
}

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_ATTACHMENT_CHARS = 6_000_000; // ~4.5 MB of image data

export async function POST(req: NextRequest) {
  const limit = checkAiRateLimit(getClientKey(req));
  if (!limit.ok) return NextResponse.json({ error: 'Too many AI requests. Please try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  try {
    const body = await req.json().catch(() => null);
    const messages: IncomingMessage[] = Array.isArray(body?.messages) ? body.messages : [];
    const attachment: Attachment | undefined = body?.attachment;

    const history = messages
      .filter((m) => m && (m.sender === 'user' || m.sender === 'ai') && typeof m.text === 'string' && m.text.trim())
      .slice(-14);
    const last = history[history.length - 1];
    if (!last || last.sender !== 'user') {
      return NextResponse.json({ error: 'Please type a question first.' }, { status: 400 });
    }

    const contents = history.map((m, idx) => {
      const parts: Record<string, unknown>[] = [];
      const text =
        m.sender === 'ai' && m.steps?.length ? `${m.text}\n${m.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : m.text;
      parts.push({ text: text.slice(0, 6000) });
      if (idx === history.length - 1 && attachment) {
        if (
          typeof attachment.data === 'string' &&
          ALLOWED_MIME.includes(attachment.mimeType) &&
          attachment.data.length <= MAX_ATTACHMENT_CHARS
        ) {
          parts.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.data } });
        }
      }
      return { role: m.sender === 'user' ? 'user' : 'model', parts };
    });
    // Start the stream first so a failure (bad key, quota...) still returns a clean JSON error.
    const iterator = generateStream({
      contents,
      config: { systemInstruction: SYSTEM_INSTRUCTION, temperature: 0.7 },
    })[Symbol.asyncIterator]();
    const first = await iterator.next();
    if (first.done) {
      return NextResponse.json({ error: 'The AI returned an empty answer. Please try again.' }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const body$ = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(encoder.encode(first.value));
        try {
          while (true) {
            const next = await iterator.next();
            if (next.done) break;
            controller.enqueue(encoder.encode(next.value));
          }
        } catch (streamErr) {
          console.error('[ai] stream interrupted:', streamErr);
          controller.enqueue(encoder.encode('\n\n⚠️ The answer was cut off. Please ask again.'));
        }
        controller.close();
      },
    });
    return new Response(body$, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' },
    });
  } catch (err) {
    console.error('[ai] /api/ai/chat failed:', err);
    const { message, status } = describeAiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
