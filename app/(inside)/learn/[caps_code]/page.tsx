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
  const { data: n1 } = await supabase.from('lesson_nodes').select('*').eq('caps_topic_id', capsId).order('node_type')
  if (n1?.length) nodes = n1
  else {
    const { data: n2 } = await supabase.from('lesson_nodes').select('*').eq('topic_slug', slug).order('node_type')
    if (n2?.length) nodes = n2
  }
  if (!nodes) {
    const { data: n3 } = await supabase.from('lesson_nodes').select('*').ilike('topic_slug', `%${slug}%`).order('node_type')
    if (n3?.length) nodes = n3
  }

  let videoId = caps?.youtube_id
  let allVideos: any[] = []

  const { data: vidsCode } = await supabase.from('videos').select('*').eq('caps_code', slug)
  if (vidsCode?.length) allVideos = [...allVideos, ...vidsCode]

  if (!allVideos.length) {
    const { data: vidsIlike } = await supabase.from('videos').select('*').ilike('caps_code', `%${slug}%`)
    if (vidsIlike?.length) allVideos = [...allVideos, ...vidsIlike]
  }

  if (nodes?.length) {
    const nodeIds = nodes.map((n:any)=> n.id)
    if (nodeIds.length) {
      const { data: vids2 } = await supabase.from('videos').select('*').in('lesson_node_id', nodeIds)
      if (vids2?.length) allVideos = [...allVideos, ...vids2]
    }
  }

  if (capsId) {
    const { data: vids } = await supabase.from('videos').select('*').eq('caps_topic_id', capsId)
    if (vids?.length) allVideos = [...allVideos, ...vids]
  }

  const map = new Map(allVideos.map((v:any)=>[v.id, v]))
  allVideos = Array.from(map.values())

  if (allVideos.length) {
    const bNode = nodes?.find((x:any)=> x.node_type==='B' || x.node_type==='CONCEPT' || x.node_type==='LEARN_THE_CONCEPT')
    const linkedToB = bNode ? allVideos.find((v:any)=> v.lesson_node_id === bNode.id) : null
    videoId = linkedToB?.youtube_id || linkedToB?.youtubeId || allVideos[0]?.youtube_id || allVideos[0]?.youtubeId || videoId
  }

  if (!nodes?.length) return <div style={{padding:20,background:'black',color:'white'}}>No nodes for {slug} - videosFound: {allVideos.length}</div>

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#d1d5db',padding:16}}>
      <div style={{background:'#111',padding:10,borderRadius:8,fontSize:11,marginBottom:16,border:'1px solid #333'}}>
        Videos found: {allVideos.length} {allVideos.length>0? '• 🎥 INCLUDED': ''}
      </div>
      {videoId && <div style={{background:"#000",borderRadius:16,overflow:"hidden",border:"1px solid #00ff88",marginBottom:20}}><div style={{position:'relative',paddingBottom:'56.25%'}}><iframe style={{position:'absolute',inset:0,width:'100%',height:'100%'}} src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen /></div></div>}
      {nodes.map((n:any)=>{
        let pc = n.content; try{ if(typeof n.content==='string') pc=JSON.parse(n.content) }catch{}
        return <div key={n.id} style={{border:'1px solid #222',margin:'16px 0',padding:18,borderRadius:16,background:'#141414'}}><div style={{color:'#00ff88',fontWeight:'bold'}}>{n.node_type}: {n.title}</div><MathRenderer text={typeof pc==='string'? pc : pc?.body_markdown || pc?.body || ''} /></div>
      })}
    </div>
  )
}
