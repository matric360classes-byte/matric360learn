// @ts-nocheck
import { createClient } from '@supabase/supabase-js'

export default async function LearnPage({params}:{params:{caps_code:string}}){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: topic } = await supabase.from('caps_knowledge_base').select('*').eq('caps_code', params.caps_code).single()
  const { data: nodes } = await supabase.from('lesson_nodes').select('*').eq('caps_topic_id', topic.id).order('node_type')
  const get = (t:string) => nodes?.find((n:any)=> n.node_type===t)
  const cards = [
    {k:'A', label:'Introduction', color:'#00f5ff', icon:'📖'},
    {k:'B', label:'Formulas & Laws', color:'#aaff00', icon:'🧮'},
    {k:'C', label:'Worked Examples', color:'#ffaa00', icon:'✏️'},
    {k:'D', label:'Common Mistakes', color:'#ff3366', icon:'⚠️'},
    {k:'E', label:'Practice', color:'#aa88ff', icon:'🎯'},
  ]
  return(
    <div style={{background:'#0a0a0a', minHeight:'100vh', color:'white', padding:'20px'}}>
      <h1 style={{fontSize:'28px'}}>{topic.topic} - {topic.subject}</h1>
      <p style={{color:'#888'}}>CAPS {topic.grade} | Real Past Paper Content from 102 PDFs</p>
      <div style={{display:'grid', gap:'16px', marginTop:'20px'}}>
        {cards.map(c=>{
          const n = get(c.k)
          return(
            <div key={c.k} style={{border:`2px solid ${c.color}`, borderRadius:'16px', padding:'16px', background:'#111'}}>
              <div style={{color:c.color, fontWeight:'bold', fontSize:'18px'}}>{c.icon} NODE {c.k}: {c.label}</div>
              <h3>{n?.title}</h3>
              <pre style={{whiteSpace:'pre-wrap', fontFamily:'inherit', fontSize:'14px', color:'#ccc'}}>{n?.content?.body_markdown?.slice(0,2000)}</pre>
              {n?.content?.formulas && <div style={{background:'#222', padding:'10px', borderRadius:'8px', marginTop:'10px'}}>{JSON.stringify(n.content.formulas).slice(0,500)}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
