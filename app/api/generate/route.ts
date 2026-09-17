// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

const PROMPTS: any = {
  A: (topic: string) => `CAPS Grade 12 Mathematics - Topic: ${topic}
Write NODE A: Introduction. 3 short paragraphs: What it is, why it matters for final exam, CAPS weighting. 150 words. No file names. Real teaching.`,
  B: (topic: string) => `CAPS Grade 12 - Topic: ${topic}
Write NODE B: Formulas You Must Memorise.
List 4-6 formulas with examples. e.g. a^2-b^2=(a-b)(a+b). Explain when to use.
No file names. Only formulas and usage.`,
  C: (topic: string) => `CAPS - Topic: ${topic}
Write NODE C: Worked Examples from Past Papers.
Give 2 exam questions (Nov 2023/2024 style) with step-by-step solution and marks.
No file names.`,
  D: (topic: string) => `Chief Marker Report - Topic: ${topic}
Write NODE D: Common Mistakes Learners Make.
List 3 mistakes, what they do wrong, correct method, marks lost in NSC.
No file names.`,
  E: (topic: string) => `NSC Examiner - Topic: ${topic}
Write NODE E: Practice Like Exam.
Give 3 questions (2 marks, 3 marks, 4 marks) + memo at bottom.
No file names. CAPS aligned.`
}

export async function POST(req: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { caps_code, node_type } = await req.json()

  const { data: topic } = await supabase.from('caps_knowledge_base').select('*').eq('caps_code', caps_code).single()
  if (!topic) return Response.json({ error: 'Not found: ' + caps_code }, { status: 404 })

  const prompt = PROMPTS[node_type](topic.topic)

  const ai = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 900,
      temperature: 0.4
    })
  })

  const aiJson = await ai.json()
  const text = aiJson.choices?.[0]?.message?.content || 'AI failed'

  // Clean out PDF spam if present
  if (text.includes('.pdf') || text.includes('Built from')) {
    return Response.json({ error: 'AI still returning PDF list - prompt failed', raw: text.slice(0, 300) }, { status: 500 })
  }

  await supabase.from('lesson_nodes').upsert({
    caps_topic_id: topic.id,
    node_type,
    title: `${topic.topic} - Node ${node_type}`,
    content: { body_markdown: text, updated_at: new Date().toISOString() }
  }, { onConflict: 'caps_topic_id,node_type' })

  return Response.json({ success: true, caps_code, node_type, preview: text.slice(0, 200) })
}

export async function GET() {
  return Response.json({ ok: true, use: 'POST /api/generate {caps_code, node_type}' })
}
