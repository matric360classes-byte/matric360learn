// @ts-nocheck
export const dynamic = 'force-dynamic'
export const maxDuration = 300

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const batch = parseInt(searchParams.get('batch') || '0')
  const BATCH_SIZE = 3 // 3 topics x 5 nodes = 15 OpenAI calls per request (safe for timeout)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: topics, error } = await supabase
    .from('caps_knowledge_base')
    .select('id, topic, subject, grade, caps_code')
    .range(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE - 1)
    .order('id')

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!topics?.length) return Response.json({ done: true, message: 'All 675 nodes generated!' })

  let count = 0

  for (const t of topics) {
    // 1. DELETE old PDF spam (the 92 docs reused row you screenshotted)
    await supabase.from('lesson_nodes').delete().eq('caps_topic_id', t.id)

    const nodesToCreate = [
      {
        type: 'A',
        title: 'Concept Explained',
        prompt: `You are a CAPS expert. Topic: ${t.topic} (${t.caps_code}), ${t.subject} Grade ${t.grade}. Write NODE A: Concept Explained in 250 words. Simple language, definitions, why it matters for NSC. No mention of PDFs.`
      },
      {
        type: 'B',
        title: 'Formulas You Must Memorise',
        prompt: `You are a CAPS expert. Topic: ${t.topic} (${t.caps_code}), ${t.subject} Grade ${t.grade}. Write NODE B: All formulas for this topic with formula + 1 example each. Use markdown. Format like: **Formula:** a² - b² = (a-b)(a+b). NO PDF names, NO "built from docs". Pure clean formulas.`
      },
      {
        type: 'C',
        title: 'Worked Examples',
        prompt: `You are a CAPS expert. Topic: ${t.topic}, ${t.subject} Grade ${t.grade}. Write NODE C: 3 worked examples from easy to exam level with full steps. CAPS aligned.`
      },
      {
        type: 'D',
        title: 'Exam Traps',
        prompt: `You are a CAPS expert. Topic: ${t.topic}, ${t.subject} Grade ${t.grade}. Write NODE D: 5 Common Exam Traps and mistakes learners make in NSC for this topic.`
      },
      {
        type: 'E',
        title: 'Practice Questions',
        prompt: `You are a CAPS expert. Topic: ${t.topic}, ${t.subject} Grade ${t.grade}. Write NODE E: 5 practice questions with memo at end. NSC style.`
      }
    ]

    for (const node of nodesToCreate) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: node.prompt }],
          temperature: 0.3,
        })

        const markdown = completion.choices[0].message.content || ''

        await supabase.from('lesson_nodes').insert({
          caps_topic_id: t.id,
          node_type: node.type,
          title: node.title,
          content: { body_markdown: markdown }
        })
        count++
      } catch (e: any) {
        console.log(`Failed ${t.caps_code} ${node.type}: ${e.message}`)
      }
    }
  }

  return Response.json({
    success: true,
    batch,
    topics_processed: topics.map(t => t.caps_code),
    nodes_created: count,
    next_step: `Done batch ${batch}. Now open /api/generate-all?batch=${batch + 1} to generate next 15 nodes. Repeat until done:true`,
    next_url: `https://matric360learn.vercel.app/api/generate-all?batch=${batch + 1}`
  })
}
