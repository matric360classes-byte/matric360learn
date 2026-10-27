// @ts-nocheck
export const dynamic = 'force-dynamic'
import { createClient } from '@supabase/supabase-js'
import 'katex/dist/katex.min.css'
import katex from 'katex'

function MathRenderer({ text }: { text: string }) {
  if (!text) return null
  const regex = /(\[.*?\]|\(.*?\)|\$\$.*?\$\$|\$[^$]+?\$)/gs
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

  // --- FUZZY CLOSEST NAME - names don't need to be exact ---
  const getScore = (target:string, candidate:string) => {
    if(!target || !candidate) return 0;
    const t = target.toLowerCase().replace(/[-_]/g,' ').replace(/[^a-z0-9 ]/g,'').split(/\s+/).filter(Boolean);
    const c = candidate.toLowerCase().replace(/[-_]/g,' ').replace(/[^a-z0-9 ]/g,'').split(/\s+/).filter(Boolean);
    if(!t.length || !c.length) return 0;
    if(t.join(' ') === c.join(' ')) return 100;
    if(c.join(' ').includes(t.join(' ')) || t.join(' ').includes(c.join(' '))) return 90;
    let common = 0;
    t.forEach(w=>{ if(c.includes(w) || c.some(cw=> cw.includes(w) || w.includes(cw) && w.length>3)) common++; });
    if(t[0] && c[0] && t[0]===c[0]) common+=1;
    return Math.round((common / Math.max(t.length, c.length)) * 80);
  };

  let videoId = caps?.youtube_id
  let allVideos: any[] = []

  const { data: vidsCode } = await supabase.from('videos').select('*').eq('caps_code', slug)
  if (vidsCode?.length) allVideos = [...allVideos, ...vidsCode]

  // FUZZY: check closest similar names in ALL videos
  const { data: allVids } = await supabase.from('videos').select('*').limit(500)
  if (allVids?.length) {
    const scored = allVids.map((v:any)=>{
      const s1 = getScore(slug, v.caps_code || '')
      const s2 = getScore(slug, v.topic || '')
      const s3 = getScore(caps?.topic || '', v.topic || '')
      const s4 = getScore(caps?.topic || '', v.unit || '')
      const s5 = getScore(caps?.topic || '', v.subtopic || '')
      return {...v, _score: Math.max(s1,s2,s3,s4,s5)}
    }).filter((v:any)=> v._score >= 25).sort((a:any,b:any)=> b._score - a._score).slice(0,10)
    allVideos = [...allVideos, ...scored]
  }

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

  // === NEW FORCE FIX - SEARCH BY HOW WE ADDED THEM (unit + subtopic + topic) ===
  if (caps?.topic) {
    const { data: vByUnit } = await supabase.from('videos').select('*').ilike('unit', `%${caps.topic}%`)
    if (vByUnit?.length) allVideos = [...allVideos, ...vByUnit]
    
    const { data: vBySubtopic } = await supabase.from('videos').select('*').ilike('subtopic', `%${caps.topic}%`)
    if (vBySubtopic?.length) allVideos = [...allVideos, ...vBySubtopic]

    const { data: vByTopic } = await supabase.from('videos').select('*').ilike('topic', `%${caps.topic}%`)
    if (vByTopic?.length) allVideos = [...allVideos, ...vByTopic]
  }
  // Also search by caps_code words in unit/subtopic
  const words = slug.split('-').filter((w:string)=> w.length>3)
  for (const w of words.slice(0,3)) {
    const { data: vW1 } = await supabase.from('videos').select('*').ilike('unit', `%${w}%`)
    if (vW1?.length) allVideos = [...allVideos, ...vW1]
    const { data: vW2 } = await supabase.from('videos').select('*').ilike('subtopic', `%${w}%`)
    if (vW2?.length) allVideos = [...allVideos, ...vW2]
  }

  const map = new Map(allVideos.map((v:any)=>[v.id, v]))
  allVideos = Array.from(map.values()).sort((a:any,b:any)=> (b._score||0)-(a._score||0))

  if (allVideos.length) {
    const bNode = nodes?.find((x:any)=> x.node_type==='B' || x.node_type==='CONCEPT' || x.node_type==='LEARN_THE_CONCEPT')
    const linkedToB = bNode ? allVideos.find((v:any)=> v.lesson_node_id === bNode.id) : null
    videoId = linkedToB?.youtube_id || linkedToB?.youtubeId || allVideos[0]?.youtube_id || allVideos[0]?.youtubeId || videoId
  }

  if (!nodes?.length) return <div style={{padding:20,background:'black',color:'white'}}>No nodes for {slug} - videosFound: {allVideos.length} closest: {allVideos[0]?.caps_code} ({allVideos[0]?._score}%) unit: {allVideos[0]?.unit} subtopic: {allVideos[0]?.subtopic}</div>

  return (
    <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#d1d5db',padding:16}}>
      <div style={{background:'#111',padding:10,borderRadius:8,fontSize:11,marginBottom:16,border:'1px solid #333'}}>
        Slug: {slug} - Topic: {caps?.topic} - Videos found: {allVideos.length} {allVideos.length>0? `• 🎥 INCLUDED - ${allVideos[0]?.caps_code || allVideos[0]?.unit} / ${allVideos[0]?.subtopic || allVideos[0]?.topic} (${allVideos[0]?._score}%)`: ''} - youtube: {allVideos[0]?.youtube_id}
      </div>
      {videoId && <div style={{background:"#000",borderRadius:16,overflow:"hidden",border:"1px solid #00ff88",marginBottom:20}}><div style={{position:'relative',paddingBottom:'56.25%'}}><iframe style={{position:'absolute',inset:0,width:'100%',height:'100%'}} src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen /></div></div>}
      {nodes.map((n:any)=>{
        let pc = n.content; try{ if(typeof n.content==='string') pc=JSON.parse(n.content) }catch{}
        return <div key={n.id} style={{border:'1px solid #222',margin:'16px 0',padding:18,borderRadius:16,background:'#141414'}}><div style={{color:'#00ff88',fontWeight:'bold'}}>{n.node_type}: {n.title}</div><MathRenderer text={typeof pc==='string'? pc : pc?.body_markdown || pc?.body || ''} /></div>
      })}
    </div>
  )
}
