// @ts-nocheck
export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { extractForTopic } from '@/lib/pdfExtractor'

export async function POST() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const TOPICS = [
    { slug: 'arithmetic-series', title: 'Arithmetic Series' },
    { slug: 'geometric-series', title: 'Geometric Series' },
    { slug: 'momentum', title: 'Momentum' }
  ]
  let total = 0
  for (const t of TOPICS) {
    const ex = await extractForTopic(supabase, t.slug, t.title)
    const nodes = ['A','B','C','D','E'].map(l => ({
      id: `${t.slug}-${l}`,
      topic_slug: t.slug,
      node_label: l,
      title: `${t.title} - ${l}`,
      status: 'approved',
      content: { body_markdown: ex.rawText.slice(0,500), formulas: ex.formulas }
    }))
    await supabase.from('lesson_nodes').upsert(nodes, { onConflict: 'id' })
    total += 5
  }
  return NextResponse.json({ message: `Created ${total}`, totalCreated: total })
}
