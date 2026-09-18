// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'

function CleanContent({ text }: { text: string }) {
  let clean = text
    // Remove NODE headers
   .replace(/\*\*NODE.*?\*\*/g, '')
   .replace(/###\s?/g, '')
    // Fix formulas: \frac{a}{b} -> a/b
   .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
   .replace(/\\times/g, ' × ')
   .replace(/\\cdot/g, ' · ')
   .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
   .replace(/\$/g, '')
    // Bold
   .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    // Break lines
   .replace(/\n/g, '<br/>')

  return <div dangerouslySetInnerHTML={{ __html: clean }} style={{ lineHeight: '1.8' }} />
}

export default async function LearnPage({ params }: any) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, key)
  const slug = params.caps_code

  const { data: nodes } = await supabase
.from('lesson_nodes')
.select('*')
.eq('caps_topic_id', slug)
.order('node_type', { ascending: true })

  if (!nodes || nodes.length===0) return <div style={{padding:20,background:'black',color:'white'}}>No nodes for {slug}</div>

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white', padding: '16px', paddingBottom:'100px' }}>
      <h1 style={{fontSize:'22px',fontWeight:'bold',textTransform:'capitalize'}}>{nodes[0].topic_slug?.replace(/-/g,' ')}</h1>
      <p style={{color:'#00ff88',marginBottom:'16px',fontSize:'13px'}}>{nodes.length} nodes • 675 lessons safe</p>
      {nodes.map((n:any)=>{
        const body = typeof n.content === 'string'? n.content : n.content?.body_markdown || JSON.stringify(n.content)
        return (
          <div key={n.id} style={{border:'1px solid #222',margin:'14px 0',padding:'16px',borderRadius:'16px',background:'#141414'}}>
            <div style={{color:'#00ff88',fontWeight:'bold',marginBottom:'10px'}}>{n.node_type}: {n.title}</div>
            <div style={{color:'#d1d5db',fontSize:'14.5px'}}><CleanContent text={body} /></div>
          </div>
        )
      })}
    </div>
  )
}
