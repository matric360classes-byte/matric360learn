// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import 'katex/dist/katex.min.css'
import katex from 'katex'

function MathRenderer({ text }: { text: string }) {
  if (!text) return null
  let content = text.replace(/\*\*NODE.*?\*\*/g, '').replace(/###\s?/g, '\n')
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs
  const parts = content.split(regex)
  const htmlParts = parts.map(part => {
    if (!part) return ''
    const isBlock = (part.startsWith('\\[') && part.endsWith('\\]')) || (part.startsWith('$$') && part.endsWith('$$'))
    const isInline = (part.startsWith('\\(') && part.endsWith('\\)')) || (part.startsWith('$') && part.endsWith('$') && part.length > 2)
    if (isBlock || isInline) {
      let math = part
      if (part.startsWith('\\[')) math = part.slice(2, -2)
      else if (part.startsWith('\\(')) math = part.slice(2, -2)
      else if (part.startsWith('$$')) math = part.slice(2, -2)
      else if (part.startsWith('$')) math = part.slice(1, -1)
      try {
        return katex.renderToString(math, { displayMode: isBlock, throwOnError: false })
      } catch { return part }
    }
    return part.replace(/\*\*(.*?)\*\*/g, '<b style="color:#fff">$1</b>').replace(/\n/g, '<br/>')
  })
  return <div dangerouslySetInnerHTML={{ __html: htmlParts.join('') }} style={{ lineHeight: '1.9', fontSize: '15px' }} />
}

export default async function LearnPage({ params }: any) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(url, key)
  const slug = params.caps_code
  const { data: nodes } = await supabase.from('lesson_nodes').select('*').eq('caps_topic_id', slug).order('node_type', { ascending: true })
  if (!nodes || nodes.length===0) return <div style={{padding:20,background:'black',color:'white',minHeight:'100vh'}}>No nodes for {slug}</div>
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#d1d5db', padding: '16px', paddingBottom: '100px' }}>
      <h1 style={{fontSize:'22px',fontWeight:'bold',color:'white',textTransform:'capitalize'}}>{nodes[0].topic_slug?.replace(/-/g,' ')}</h1>
      <p style={{color:'#00ff88',marginBottom:'16px',fontSize:'13px'}}>{nodes.length} nodes • PDF formula rendering ON</p>
      {nodes.map((n:any)=>{
        const body = typeof n.content === 'string'? n.content : n.content?.body_markdown || n.content?.body || JSON.stringify(n.content)
        return (
          <div key={n.id} style={{border:'1px solid #222',margin:'16px 0',padding:'18px',borderRadius:'16px',background:'#141414'}}>
            <div style={{color:'#00ff88',fontWeight:'bold',marginBottom:'12px',fontSize:'16px'}}>{n.node_type}: {n.title}</div>
            <MathRenderer text={body} />
          </div>
        )
      })}
    </div>
  )
}
