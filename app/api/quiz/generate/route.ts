import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { describeAiError, generate } from '@/lib/ai/gemini';


interface FormattedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface GenerateQuizRequest {
  chapterTitle: string;
  subject?: string;
  lessonContent: string;
  questionCount?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateQuizRequest = await req.json();
    const {
      chapterTitle,
      subject = 'General',
      lessonContent,
      questionCount = 5,
      difficulty = 'Medium',
    } = body ?? {};

    const safeQuestionCount = Number.isInteger(questionCount)
      ? Math.min(Math.max(questionCount, 1), 10)
      : 5;
    const safeDifficulty = ['Easy', 'Medium', 'Hard'].includes(difficulty)
      ? difficulty
      : 'Medium';
    const safeSubject = typeof subject === 'string' && subject.trim()
      ? subject.trim().slice(0, 80)
      : 'General';

    if (
      typeof chapterTitle !== 'string' ||
      typeof lessonContent !== 'string' ||
      !chapterTitle.trim() ||
      lessonContent.trim().length < 30
    ) {
      return NextResponse.json(
        { error: 'Chapter title and lesson content are required.' },
        { status: 400 }
      );
    }

    {
      try {

        const prompt = `You are an expert teacher creating a multiple-choice practice quiz for a student.
Chapter / Topic: "${chapterTitle}"
Subject: "${safeSubject}"
Difficulty: "${safeDifficulty}"
Number of questions: ${safeQuestionCount}

Lesson Content:
"""
${lessonContent.slice(0, 10000)}
"""

Instructions:
1. Create exactly ${safeQuestionCount} multiple-choice questions based strictly on the provided lesson content.
2. For each question, provide:
   - "question": Clear, engaging question statement.
   - "options": Array of exactly 4 plausible answer choices.
   - "correctAnswer": The 0-based index (0, 1, 2, or 3) of the correct option.
   - "explanation": A clear 1-2 sentence explanation of why this answer is correct.
3. Return valid JSON only.`;

        const response = await generate({
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                    },
                    required: ['question', 'options', 'correctAnswer', 'explanation'],
                  },
                },
              },
              required: ['questions'],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed.questions) && parsed.questions.length > 0) {
            const formatted = parsed.questions
              .map((q: unknown, i: number): FormattedQuestion | null => {
                if (!q || typeof q !== 'object') return null;
                const item = q as Record<string, unknown>;
                const options = Array.isArray(item.options)
                  ? item.options.filter((option): option is string => typeof option === 'string').slice(0, 4)
                  : [];
                const correctAnswer = Number.isInteger(item.correctAnswer) ? Number(item.correctAnswer) : -1;
                if (
                  typeof item.question !== 'string' ||
                  !item.question.trim() ||
                  options.length !== 4 ||
                  correctAnswer < 0 ||
                  correctAnswer > 3
                ) {
                  return null;
                }
                return {
                  id: `gen-q-${i + 1}`,
                  question: item.question.trim(),
                  options,
                  correctAnswer,
                  explanation:
                    typeof item.explanation === 'string' && item.explanation.trim()
                      ? item.explanation.trim()
                      : 'Verified from the lesson text.',
                };
              })
              .filter((question: FormattedQuestion | null): question is FormattedQuestion => question !== null)
              .slice(0, safeQuestionCount);

            if (formatted.length === 0) {
              throw new Error('Gemini returned no valid quiz questions.');
            }

            return NextResponse.json({
              success: true,
              quiz: {
                id: `quiz-gen-${Date.now()}`,
                title: chapterTitle.trim(),
                subject: safeSubject,
                questionsCount: formatted.length,
                difficulty: safeDifficulty,
                symbol: subject === 'Mathematics' ? '√x' : subject === 'Physics' ? '⚡' : subject === 'Chemistry' ? '⚗' : '📖',
                colorScheme: difficulty === 'Hard' ? 'purple' : difficulty === 'Easy' ? 'emerald' : 'blue',
                questions: formatted,
              },
            });
          }
        }
      } catch (geminiError) {
        console.error('[ai] quiz generation failed:', geminiError);
        const { message, status } = describeAiError(geminiError);
        return NextResponse.json({ error: message }, { status });
      }
    }

    return NextResponse.json(
      { error: 'The AI could not create a quiz from this text. Please try again.' },
      { status: 502 }
    );
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while generating the quiz.' },
      { status: 500 }
    );
  }
}
