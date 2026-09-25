// @ts-nocheck
export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const batch = parseInt(searchParams.get('batch') || '0')
  const BATCH_SIZE = 3

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // SAME as your generate-all - reads from caps_knowledge_base (your 103 PDFs)
  const { data: topics, error } = await supabase
   .from('caps_knowledge_base')
   .select('id, topic, subject, grade, caps_code')
   .range(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE - 1)
   .order('id')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!topics || topics.length === 0) return Response.json({ questions_created: 0, message: "No topics in this batch" })

  let totalQuestions = 0

  for (const t of topics) {
    // NO TERM - use clean grouping
    const prompt = `
You are generating Matric exam questions for:
Subject: ${t.subject}
Unit/Topic: ${t.topic}
CAPS code: ${t.caps_code}

RULES - NO TERM:
- Group as: ${t.subject} > ${t.topic} > subtopic (NO Grade 12 / Term 2)
- Generate 8 questions per topic
- Mix: L1=Easy, L2-L3=Medium, L4=Hard, L5=Exam Style
- Return JSON: {"questions": [{"question_text": "...", "unit": "${t.topic}", "topic": "subtopic", "difficulty_l": "L3", "difficulty_label": "Medium", "marks": 3, "correct_answer": "...", "explanation": "full memo"}]}
`

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })

    const parsed = JSON.parse(resp.choices[0].message.content || "{}")
    const questions = parsed.questions || []

    for (const q of questions) {
      await supabase.from('questions').insert({
        question_text: q.question_text,
        subject: t.subject,
        unit: t.topic, // Main unit from caps_knowledge_base
        topic: q.topic, // Subtopic - NO TERM
        topic_path: `${t.subject} > ${t.topic} > ${q.topic}`,
        difficulty_l: q.difficulty_l,
        difficulty_label: q.difficulty_label,
        marks: q.marks,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        access: "Free",
        source_topic_id: t.id
      })
    }
    totalQuestions += questions.length
  }

  return Response.json({
    batch,
    questions_created: totalQuestions,
    topics_processed: topics.length
  })
}
