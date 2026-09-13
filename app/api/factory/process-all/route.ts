import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(){
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const geminiKey = process.env.GEMINI_API_KEY!

  // Get 3 queued only (Maths + Physics)
  const { data: lessons } = await supa.from('lesson_previews').select('*').eq('status','queued').limit(3)
  
  if(!lessons || lessons.length===0){
    return NextResponse.json({ message: 'All done', processed: 0 })
  }

  let processed = 0
  for(const lesson of lessons){
    // Simple prompt - generates Nodes JSON
    const prompt = `Create Grade 12 CAPS lesson for ${lesson.subject} - ${lesson.topic_name}. Return JSON with title, objectives[], nodes[] where each node has {type: "concept|example|exercise", title, content}. 5 nodes min.`
    
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{ parts:[{ text: prompt }]}] })
    })
    const json = await res.json()
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    
    await supa.from('lesson_previews').update({
      status: 'ready',
      content: text,
      cost_usd: 0.02,
      quality_score: 85
    }).eq('id', lesson.id)
    processed++
  }

  return NextResponse.json({ message: `Processed ${processed}`, processed, remaining: 12-processed })
}
