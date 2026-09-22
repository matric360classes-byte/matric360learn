// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import 'katex/dist/katex.min.css'
import katex from 'katex'

function MathRenderer({ text }: { text: string }) {
  if (!text) return null
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs
  const parts = text.split(regex)
  return <div dangerouslySetInnerHTML={{ __html: parts.map(p=>{
    if(!p) return ''
    const isBlock=(p.startsWith('\\[')&&p.endsWith('\\]'))||(p.startsWith('$$')&&p.endsWith('$$'))
    const isInline=(p.startsWith('\\(')&&p.endsWith('\\)'))||(p.startsWith('$')&&p.endsWith('$'))
    if(isBlock||isInline){
      let m=p; if(p.startsWith('\\[')) m=p.slice(2,-2); else if(p.startsWith('\\(')) m=p.slice(2,-2); else if(p.startsWith('$$')) m=p.slice(2,-2); else if(p.startsWith('$')) m=p.slice(1,-1)
      try{ return katex.renderToString(m,{displayMode:isBlock,throwOnError:false}) }catch{ return p }
    }
    return p.replace(/\n/g,'<br/>')
  }).join('')}} />
}

export default async function LearnPage({ params }: any) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const slug = params.caps_code

  const { data: capsByCode } = await supabase.from('caps_knowledge_base').select('*').eq('caps_code', slug).maybeSingle()
  const { data: capsById } =!capsByCode? await supabase.from('caps_knowledge_base').select('*').eq('id', slug).maybeSingle() : { data: null }
  const caps = capsByCode || capsById
  const capsId = caps?.id

  let nodes = null
  const { data: n1 } = await supabase.from('lesson_nodes').select('*').eq('caps_topic_id', slug).order('node_type')
  if (n1?.length) nodes = n1
  else if (capsId) {
    const { data: n2 } = await supabase.from('lesson_nodes').select('*').eq('caps_topic_id', capsId).order('node_type')
    if (n2?.length) nodes = n2
  }
  if (!nodes) {
    const { data: n3 } = await supabase.from('lesson_nodes').select('*').eq('topic_slug', slug).order('node_type')
    if (n3?.length) nodes = n3
  }

  const videoId = caps?.youtube_id
  if (!nodes?.length) return <div style={{padding:20,background:'black',color:'white'}}>No nodes for {slug} - capsId: {capsId||'not found'} - video: {videoId||'none'}</div>

  // Debug for Node B
  const debugNodeB = nodes.find((x:any)=>x.node_type==='B')
  let debugContent = debugNodeB?.content
  try{ if(typeof debugContent==='string') debugContent = JSON.parse(debugContent)}catch{}
  const debugYoutube = debugContent?.youtubeId || debugContent?.youtube_id || 'none'

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#d1d5db',padding:16}}>
      <h1 style={{color:'white',fontSize:20}}>{nodes[0].topic_slug} - {nodes.length} nodes</h1>

      {/* GREY DEBUG BOX - YOU WILL SEE THIS NOW */}
      <div style={{background:'#111',padding:10,borderRadius:8,fontSize:11,marginBottom:16,border:'1px solid #333',color:'#aaa'}}>
        <div>Page Slug: {slug}</div>
        <div>Real capsId: {capsId}</div>
        <div>caps.youtube_id: {videoId || 'none'}</div>
        <div>Node B youtube: {debugYoutube}</div>
        <div>Node B id: {debugNodeB?.id || 'not found'}</div>
      </div>

      {videoId && (
        <div style={{background:"#000",borderRadius:16,overflow:"hidden",border:"1px solid #00ff88",marginBottom:20}}>
          <div style={{position:'relative',paddingBottom:'56.25%'}}>
            <iframe style={{position:'absolute',inset:0,width:'100%',height:'100%'}} src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen />
          </div>
        </div>
      )}

      {nodes.map((n:any)=>{
        let parsedContent = n.content
        try { if(typeof n.content === 'string') parsedContent = JSON.parse(n.content) } catch {}
        const nodeYoutubeId = parsedContent?.youtubeId || parsedContent?.youtube_id || (n.node_type === 'B'? videoId : null)

        return (
          <div key={n.id} style={{border:'1px solid #222',margin:'16px 0',padding:18,borderRadius:16,background:'#141414'}}>
            <div style={{color:'#00ff88',fontWeight:'bold'}}>{n.node_type}: {n.title}</div>

            {nodeYoutubeId && n.node_type === 'B' && (
              <div style={{background:"#000",borderRadius:12,overflow:"hidden",border:"1px solid #00ff88",margin:"12px 0"}}>
                <div style={{position:'relative',paddingBottom:'56.25%'}}>
                  <iframe style={{position:'absolute',inset:0,width:'100%',height:'100%'}} src={`https://www.youtube.com/embed/${nodeYoutubeId}`} allowFullScreen />
                </div>
              </div>
            )}

            <MathRenderer text={typeof parsedContent==='string'? parsedContent : parsedContent?.body_markdown || parsedContent?.body || ''} />
          </div>
        )
      })}
    </div>
  )
}
