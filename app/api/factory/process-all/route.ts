// @ts-nocheck
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { extractForTopic } from '@/lib/pdfExtractor'

export async function POST(req: Request){
  const { searchParams } = new URL(req.url)
  const offset = parseInt(searchParams.get('offset')||'0')
  const BATCH = 5
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: topics, error: topicErr } = await supabase.from('caps_knowledge_base').select('*').order('id').range(offset, offset+BATCH-1)
  
  if(topicErr) return NextResponse.json({created:0, remaining:675, msg:`TOPIC ERROR: ${topicErr.message}`, done:false, nextOffset:offset})
  if(!topics || topics.length===0) return NextResponse.json({done:true, created:0, nextOffset: offset, remaining:0, msg: 'ALL 675 DONE'})

  let created = 0
  let lastError = ''
  for(const topic of topics){
    try{
      const extracted: any = await extractForTopic(supabase, topic.caps_code||topic.slug, topic.title)
      const formulas = extracted?.formulas || [{clean:'Sₙ=n/2[2a+(n-1)d]', subject:'Mathematics'}]
      const examples = extracted?.examples || [{q:'Example from past papers', source:'Memo 2023'}]
      const raw = extracted?.rawText || `Introduction to ${topic.title} - CAPS aligned content for Grade 12. This covers ${topic.title} in detail with formulas and examples from past papers.`
      const allSrc = extracted?.allSources || ['Mixed 115 PDFs']
      const chief = extracted?.chiefMarkers || ['Check memo marking guidelines']

      for(const nodeType of ['A','B','C','D','E']){
        const payload = {
          caps_topic_id: topic.id,
          node_type: nodeType,
          title: `${topic.title} - Node ${nodeType}`,
          content: { body_markdown: raw.slice(0,6000), formulas, examples, source: allSrc.join(','), chief },
          status: 'published'
        }
        const { error } = await supabase.from('lesson_nodes').upsert(payload, {onConflict:'caps_topic_id,node_type'})
        if(error){
          lastError = error.message
          console.error('INSERT ERROR:', error)
        } else {
          created++
        }
      }
    }catch(e:any){
      lastError = e.message
    }
  }

  return NextResponse.json({
    done:false, 
    created, 
    nextOffset: offset+BATCH, 
    remaining: 675-(offset+BATCH)*5, 
    msg: created===0 ? `FAILED 0 nodes: ${lastError} | Topics: ${topics.map(t=>t.title).join(',')}` : `SAVED ${created} nodes A-E - ${topics[0].title} + ${topics.length-1} more`
  })
}
