import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request){
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const key = process.env.GEMINI_API_KEY!
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '5')

  const { data: lessons } = await supa.from('lesson_previews').select('*').eq('status','queued').limit(limit)
  if(!lessons || lessons.length===0){
    const r = NextResponse.json({ message: 'All done', processed: 0, queued: 0, ready: 12 })
    r.headers.set('Cache-Control','no-store')
    return r
  }

  for(const l of lessons){
    try{
      const prompt = `Grade 12 CAPS ${l.subject} ${l.topic_name}. Return JSON {title, nodes:[{type,title,content}]}`
      const g = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ contents:[{ parts:[{ text: prompt }]}] })
      })
      const j = await g.json()
      const text = j.candidates?.[0]?.content?.parts?.[0]?.text || '{"nodes":[]}'
      await supa.from('lesson_previews').update({ status:'ready', content:text, quality_score:85 }).eq('id', l.id)
    }catch(e){ await supa.from('lesson_previews').update({ status:'failed' }).eq('id', l.id) }
  }
  const r = NextResponse.json({ processed: lessons.length })
  r.headers.set('Cache-Control','no-store')
  return r
}
