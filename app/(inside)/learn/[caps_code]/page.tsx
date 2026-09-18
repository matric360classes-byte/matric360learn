// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'

export default async function LearnPage({ params }: any) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, key)
  const slug = params.caps_code

  // Try lesson_nodes (your real table)
  const { data: nodes, error } = await supabase
  .from('lesson_nodes')
  .select('*')
  .eq('caps_code', slug)
  .order('node_type', { ascending: true })

  if (error) return <div style={{padding:20,background:'black',color:'white'}}>Error: {error.message} - table lesson_nodes missing caps_code column? Check Supabase.</div>
  if (!nodes || nodes.length===0) return <div style={{padding:20,background:'black',color:'white',minHeight:'100vh'}}>Topic not found for {slug} - found 0 nodes in lesson_nodes. Check if caps_code field exists.</div>

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: '20px' }}>
      <h1 style={{fontSize:'28px',fontWeight:'bold'}}>{nodes[0].topic_title || nodes[0].title}</h1>
      <p style={{color:'#888'}}>{slug} • {nodes.length} nodes</p>
      {nodes.map((n:any)=>(
        <div key={n.id} style={{border:'1px solid #333',margin:'16px 0',padding:'16px',borderRadius:'12px',background:'#111'}}>
          <b style={{color:'#00ff88'}}>NODE {n.node_type}: {n.title}</b>
          <div style={{whiteSpace:'pre-wrap',color:'#ccc',fontSize:'14px',marginTop:'8px'}}>
            {typeof n.content === 'string'? n.content : n.content?.body_markdown || JSON.stringify(n.content).slice(0,3000)}
          </div>
        </div>
      ))}
    </div>
  )
}
