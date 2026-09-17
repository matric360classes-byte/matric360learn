import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { extractForTopic } from '@/lib/pdfExtractor'

export async function POST(req: Request){
  const { searchParams } = new URL(req.url)
  const offset = parseInt(searchParams.get('offset')||'0')
  const BATCH = 5
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: topics } = await supabase.from('caps_knowledge_base').select('*').order('id').range(offset, offset+BATCH-1)
  if(!topics || topics.length===0) return NextResponse.json({done:true, created:0, nextOffset: offset, remaining:0, msg: 'ALL 675 DONE'})
  let created = 0
  for(const topic of topics){
    const extracted = await extractForTopic(supabase, topic.caps_code||topic.slug, topic.title)
    const nodes = [
      { t:'A', title:`${topic.title} - Introduction`, body: extracted.rawText.slice(0,5500), formulas: extracted.formulas.slice(0,1) },
      { t:'B', title:`${topic.title} - Formulas & Laws`, body:`REAL FORMULAS from ${extracted.subject} pool: ${extracted.allSources?.slice(0,4).join(', ')}`, formulas: extracted.formulas },
      { t:'C', title:`${topic.title} - Worked Examples`, body: JSON.stringify(extracted.examples[0]), formulas: extracted.formulas },
      { t:'D', title:`${topic.title} - Common Mistakes`, body:`Chief Markers: ${extracted.chiefMarkers?.join(', ')||'Markers reports'}`, formulas: [] },
      { t:'E', title:`${topic.title} - Practice`, body: JSON.stringify(extracted.examples), formulas: extracted.formulas }
    ]
    for(const n of nodes){
      const { error } = await supabase.from('lesson_nodes').upsert({
        caps_topic_id: topic.id,
        node_type: n.t,
        title: n.title,
        content: { body_markdown: n.body, formulas: n.formulas, examples: extracted.examples, source_pdf_id: extracted.sourceId, allSources: extracted.allSources, subject: extracted.subject },
        status: 'published'
      }, {onConflict:'caps_topic_id,node_type'})
      if(!error) created++
    }
  }
  return NextResponse.json({done:false, created, nextOffset: offset+BATCH, remaining: 675-(offset+BATCH)*5, msg: `Batch ${offset/BATCH+1}/27: +${created} nodes A-E`})
}
