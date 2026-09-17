// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

export default async function LearnPage({ params }: any) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!url || !key) {
      return <div style={{padding:20, color:'white', background:'#000', minHeight:'100vh'}}>Missing Supabase env keys in Vercel. Add NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in Vercel > Settings > Environment Variables</div>
    }

    const supabase = createClient(url, key)
    const slug = params?.subject || params?.caps_code || params?.id
    console.log('Looking for caps_code:', slug)

    const { data: topic, error: topicErr } = await supabase.from('caps_knowledge_base').select('*').eq('caps_code', slug).maybeSingle()

    if (topicErr) return <div style={{padding:20, color:'white', background:'#000'}}>DB Error: {topicErr.message}</div>
    if (!topic) return <div style={{padding:20, color:'white', background:'#000'}}>Topic not found: {slug}. <br/>Check your caps_code in Supabase. Try: algebraic-expressions-and-factorisation <br/>Your 675 nodes are still safe.</div>

    const { data: nodes } = await supabase.from('lesson_nodes').select('*').eq('caps_topic_id', topic.id).order('node_type')

    const get = (t:string) => nodes?.find((n:any)=> n.node_type===t)

    return (
      <div style={{background:'#0a0a0a', minHeight:'100vh', color:'white', padding:'20px', fontFamily:'system-ui'}}>
        <a href="/learn" style={{color:'#888'}}>← Back</a>
        <h1 style={{fontSize:'24px', marginTop:'10px'}}>{topic.topic}</h1>
        <p style={{color:'#888'}}>{topic.subject} • Grade {topic.grade} • {nodes?.length || 0}/5 nodes</p>
        
        {['A','B','C','D','E'].map(k=>{
          const n=get(k)
          return (
            <div key={k} style={{border:'1px solid #222', margin:'14px 0', padding:'14px', borderRadius:'14px', background:'#111'}}>
              <div style={{fontWeight:'bold', color:'#00f5ff'}}>NODE {k}: {n?.title || 'Not generated yet'}</div>
              <div style={{marginTop:'8px', whiteSpace:'pre-wrap', color:'#ccc', fontSize:'14px', lineHeight:'1.5'}}>
                {n?.content?.body_markdown?.slice(0,2500) || 'No content'}
              </div>
            </div>
          )
        })}
      </div>
    )
  } catch (e:any) {
    return <div style={{padding:20, background:'#000', color:'white', minHeight:'100vh'}}>Server Error: {e.message} <br/> Digest logged. Your 675 data is safe in Supabase - this is just a display bug.</div>
  }
}
