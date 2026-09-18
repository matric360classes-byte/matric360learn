// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import 'katex/dist/katex.min.css'
import katex from 'katex'

function RenderMath({ text }: { text: string }) {
  // Split by block math \[...\] and inline \(...\)
  const parts = text.split(/(\$\$?|\\\[|\\\]|\\\(|\\\))/g);
  // Simple parser: replace \(...\) and \[...\] with KaTeX
  let html = text
   .replace(/\\\[(.*?)\\\]/gs, (_, math) => {
      try { return katex.renderToString(math, { displayMode: true, throwOnError: false }) } catch { return math }
    })
   .replace(/\\\((.*?)\\\)/gs, (_, math) => {
      try { return katex.renderToString(math, { displayMode: false, throwOnError: false }) } catch { return math }
    })
    // Clean markdown markers
   .replace(/\*\*NODE.*?\*\*/g, '')
   .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
   .replace(/###\s?/g, '<br/><b>')
   .replace(/\n/g, '<br/>')

  return <div dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: '1.7' }} />
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
      <h1 style={{fontSize:'22px',fontWeight:'bold',textTransform:'capitalize',marginBottom:'4px'}}>{nodes[0].topic_slug?.replace(/-/g,' ')}</h1>
      <p style={{color:'#00ff88',marginBottom:'16px',fontSize:'13px'}}>{nodes.length} nodes • 675 lessons safe</p>

      {nodes.map((n:any)=>{
        const body = typeof n.content === 'string'? n.content : n.content?.body_markdown || n.content?.body || JSON.stringify(n.content)
        return (
          <div key={n.id} style={{border:'1px solid #222',margin:'14px 0',padding:'16px',borderRadius:'16px',background:'#141414'}}>
            <div style={{color:'#00ff88',fontWeight:'bold',marginBottom:'10px',fontSize:'16px'}}>
              {n.node_type}: {n.title}
            </div>
            <div style={{color:'#d1d5db',fontSize:'14.5px'}}>
              <RenderMath text={body} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
