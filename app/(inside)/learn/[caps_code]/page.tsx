// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'

export default async function LearnPage({ params }: any) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, key)
  const slug = params.caps_code

  // FIXED: query by caps_topic_id (UUID) - this column EXISTS in your table
  const { data: nodes, error } = await supabase
 .from('lesson_nodes')
 .select('*')
 .eq('caps_topic_id', slug)
 .order('node_type', { ascending: true })

  if (error) return <div style={{padding:20,background:'black',color:'white',minHeight:'100vh'}}>Error: {error.message}</div>
  if (!nodes || nodes.length===0) return <div style={{padding:20,background:'black',color:'white',minHeight:'100vh'}}>No nodes for {slug}. Trying topic_slug... Check Supabase.</div>

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h1 style={{fontSize:'24px',fontWeight:'bold',textTransform:'capitalize'}}>{nodes[0].topic_slug?.replace(/-/g,' ')}</h1>
      <p style={{color:'#888',marginBottom:'20px'}}>{nodes.length} nodes • {nodes[0].topic_slug}</p>
      {nodes.map((n:any)=>(
        <div key={n.id} style={{border:'1px solid #333',margin:'16px 0',padding:'16px',borderRadius:'12px',background:'#111'}}>
          <b style={{color:'#00ff88'}}>{n.node_type}: {n.title}</b>
          <div style={{whiteSpace:'pre-wrap',color:'#ccc',fontSize:'14px',marginTop:'8px',lineHeight:'1.6'}}>
            {typeof n.content === 'string'? n.content : n.content?.body_markdown || JSON.stringify(n.content).slice(0,4000)}
          </div>
        </div>
      ))}
    </div>
  )
}
