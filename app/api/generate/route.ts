// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const caps_code = searchParams.get('caps_code') || 'algebraic-expressions'
  const node_type = searchParams.get('node_type') || 'B'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Get topic id
  const { data: topic, error: tErr } = await supabase
    .from('caps_knowledge_base')
    .select('id, topic')
    .eq('caps_code', caps_code)
    .single()

  if (tErr || !topic) return Response.json({ error: 'topic not found', caps_code, details: tErr }, { status: 404 })

  // 2. Clean formula (NO PDF spam)
  const clean = `### NODE B: Formulas You Must Memorise - ${topic.topic}

**1. Difference of Squares**
Formula: a² - b² = (a-b)(a+b)
Example: x² - 9 = (x-3)(x+3)

**2. Perfect Square**
Formula: (a+b)² = a² + 2ab + b²
Formula: (a-b)² = a² - 2ab + b²
Example: (x+2)² = x²+4x+4

**3. Difference/Sum of Cubes**
Formula: a³ - b³ = (a-b)(a²+ab+b²)
Formula: a³ + b³ = (a+b)(a²-ab+b²)

**4. Common Factor**
Formula: ab+ac = a(b+c)
Example: 2x+4 = 2(x+2)
`

  // 3. Save to lesson_nodes with correct structure page.tsx expects
  const { data, error } = await supabase
    .from('lesson_nodes')
    .upsert({
      caps_topic_id: topic.id,
      node_type: node_type,
      title: 'Formulas You Must Memorise',
      content: { body_markdown: clean }
    }, { onConflict: 'caps_topic_id,node_type' })
    .select()

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ 
    success: true, 
    caps_code, 
    node_type, 
    topic_id: topic.id,
    saved_to: 'lesson_nodes.content.body_markdown',
    preview: clean.slice(0,300)
  })
}
