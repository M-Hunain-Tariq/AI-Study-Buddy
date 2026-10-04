import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { describeAiError, generate } from '@/lib/ai/gemini';
import { checkAiRateLimit, getClientKey } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const limit = checkAiRateLimit(getClientKey(req));
  if (!limit.ok) return NextResponse.json({ error: 'Too many AI requests. Please try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
  try {
    const body = await req.json().catch(() => null);
    const subject = typeof body?.subject === 'string' ? body.subject.trim().slice(0, 80) : '';
    const topic = typeof body?.topic === 'string' ? body.topic.trim().slice(0, 200) : '';
    const examDate = typeof body?.examDate === 'string' ? body.examDate.trim().slice(0, 40) : '';
    const minutes = Math.min(Math.max(parseInt(String(body?.dailyMinutes)) || 60, 15), 240);
    const days = Math.min(Math.max(parseInt(String(body?.totalDays)) || 7, 1), 14);

    if (!subject || !topic) {
      return NextResponse.json({ error: 'Please enter a subject and topic.' }, { status: 400 });
    }

    const prompt = `Create a ${days}-day study plan for a school student.
Subject: ${subject}
Topics to cover: ${topic}
${examDate ? `Exam date: ${examDate}\n` : ''}Daily study time: ${minutes} minutes

Rules:
- Return exactly ${days} days, in order, building from basics to practice to revision.
- The last day should be a revision or practice test.
- "title": a specific session title naming the real subtopic to study that day (max 70 chars).
- "focus": one short phrase on what to concentrate on (max 60 chars).
- Be concrete and accurate for the subject; no filler.`;
    const response = await generate({
      contents: prompt,
      config: {
        temperature: 0.5,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: { title: { type: Type.STRING }, focus: { type: Type.STRING } },
                required: ['title', 'focus'],
              },
            },
          },
          required: ['days'],
        },
      },
    });

    let parsed: { days?: unknown } | null = null;
    try {
      parsed = JSON.parse(response.text ?? '');
    } catch {
      parsed = null;
    }
    const list = Array.isArray(parsed?.days) ? (parsed!.days as Record<string, unknown>[]) : [];
    const plan = list
      .filter((d) => d && typeof d.title === 'string' && d.title.trim())
      .slice(0, days)
      .map((d, i) => ({
        dayNum: i + 1,
        title: String(d.title).trim(),
        focus: typeof d.focus === 'string' ? d.focus.trim() : '',
        durationMinutes: minutes,
      }));

    if (plan.length === 0) {
      return NextResponse.json({ error: 'The AI could not build a plan. Please try again.' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, plan });
  } catch (err) {
    console.error('[ai] /api/ai/plan failed:', err);
    const { message, status } = describeAiError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
