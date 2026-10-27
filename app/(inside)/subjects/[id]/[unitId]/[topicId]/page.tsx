"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const META:any = {
  A:{label:"Exam Hook", icon:"📌", color:"#ff6b35"},
  B:{label:"Learn The Concept", icon:"📚", color:"#3b82f6"},
  C:{label:"Worked Example", icon:"📝", color:"#10b981"},
  D:{label:"Examiner Traps", icon:"⚠️", color:"#f59e0b"},
  E:{label:"Exam Challenge", icon:"🏆", color:"#8b5cf6"},
};
const TYPE_TO_LABEL:any = { EXAM_HOOK:"A", CONCEPT:"B", LEARN_THE_CONCEPT:"B", WORKED_EXAMPLE:"C", EXAMINER_TRAPS:"D", TRAPS:"D", EXAM_CHALLENGE:"E" };

function MathRenderer({ text }: { text: string }) {
  if (!text) return <div style={{color:"#888"}}>No content</div>;
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs;
  const parts = text.split(regex);
  const html = parts.map(part=>{
    if(!part) return '';
    const isBlock = (part.startsWith('\\[')&&part.endsWith('\\]')) || (part.startsWith('$$')&&part.endsWith('$$'));
    const isInline = (part.startsWith('\\(')&&part.endsWith('\\)')) || (part.startsWith('$')&&part.endsWith('$')&&part.length>2);
    if(isBlock||isInline){
      let math = part.slice(2,-2); if(part.startsWith('$')&&!part.startsWith('$$')) math=part.slice(1,-1);
      try{ return katex.renderToString(math,{displayMode:isBlock,throwOnError:false}) }catch{return part}
    }
    return part.replace(/\*\*(.*?)\*\*/g,'<b style="color:#fff">$1</b>').replace(/\n/g,'<br/>');
  }).join('');
  return <div dangerouslySetInnerHTML={{__html:html}} style={{lineHeight:'1.9',fontSize:'15px',color:'#e5e7eb'}} />
}
function getYoutubeId(url:string){ if(!url) return ""; const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1]:url; }

export default function Page(){
  const p = useParams() as any;
  const subjectId=p?.id, unitId=p?.unitId, topicId=p?.topicId;
  const [rows, setRows] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [active, setActive]=useState("A");

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`};
    const cleanTopicRaw = decodeURIComponent(topicId||"").toLowerCase().trim();
    const cleanUnitRaw = decodeURIComponent(unitId||"").toLowerCase().trim();
    const subjNorm = decodeURIComponent(subjectId||"").toLowerCase().includes('math')? 'mathematics' : 'physical-sciences';
    const norm=(s:string)=> (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
    const nTopic=norm(cleanTopicRaw);
    const nUnit=norm(cleanUnitRaw);

    let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code,topic&caps_code=eq.${cleanTopicRaw}&limit=1`,{headers});
    let kbArr:any = await resKb.json();
    if(!Array.isArray(kbArr)||kbArr.length===0){
      const kw=cleanTopicRaw.split('-')[0];
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code,topic&subject=eq.${subjNorm}&topic=ilike.%${kw}%&limit=1`,{headers});
      kbArr = await resKb.json();
    }
    if(Array.isArray(kbArr)&&kbArr.length>0){
      const kb=kbArr[0];
      const res=await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers});
      let nodes:any=await res.json();
      if(Array.isArray(nodes)){
        const seen=new Set(); nodes=nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
        setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
      }
    }

    // FIX 1: Fetch WITHOUT eq filter, then filter in JS (handles caps + NULL subject)
    let allRes = await fetch(`${url}/rest/v1/videos?select=*&limit=500`,{headers});
    let all:any = await allRes.json();
    if(!Array.isArray(all)) all=[];
    // Keep all videos that match subject OR have no subject OR match unit/subtopic we added
    all = all.filter((v:any)=> {
      const subjMatch = (v.subject||"").toLowerCase().includes(subjNorm.split('-')[0]) || !v.subject;
      const hasUnit = !!(v.unit || v.subtopic);
      return subjMatch || hasUnit;
    });

    // FIX 2: Resolve lesson_node_id -> caps_code
    const nodeIds=all.filter((v:any)=> !v.caps_code && !v.topic && v.lesson_node_id).map((v:any)=>v.lesson_node_id);
    if(nodeIds.length){
      const inList=nodeIds.map((id:string)=>`"${id}"`).join(',');
      const resNodes=await fetch(`${url}/rest/v1/lesson_nodes?select=id,caps_topic_id&id=in.(${inList})`,{headers});
      const nodes:any=await resNodes.json();
      if(Array.isArray(nodes)){
        const capsIds=[...new Set(nodes.map((n:any)=>n.caps_topic_id).filter(Boolean))] as string[];
        if(capsIds.length){
          const capsIn=capsIds.map((id:string)=>`"${id}"`).join(',');
          const resKb2=await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code&id=in.(${capsIn})`,{headers});
          const kbs:any=await resKb2.json();
          const kbMap=new Map((kbs||[]).map((k:any)=>[k.id,k.caps_code]));
          const nodeMap=new Map(nodes.map((n:any)=>[n.id,kbMap.get(n.caps_topic_id)]));
          all=all.map((v:any)=>{ if(!v.caps_code && !v.topic && v.lesson_node_id && nodeMap.get(v.lesson_node_id)){ return {...v, caps_code: nodeMap.get(v.lesson_node_id)}; } return v; });
        }
      }
    }

    // === NEW FORCE FIX - SEARCH BY UNIT + SUBTOPIC (how you added them) ===
    const filtered = all.filter((v:any)=>{
      const caps=norm(v.caps_code||"");
      const top=norm(v.topic||"");
      const unit=norm(v.unit||"");
      const sub=norm(v.subtopic||"");
      const combined=caps+top+unit+sub;
      if(!combined) return false;
      // Keep Doppler / Projectile logic but include unit/subtopic
      if(nUnit.includes('doppler') && !(combined.includes('doppler'))) return false;
      if(nUnit.includes('projectile') && !combined.includes('projectile') && !combined.includes('equationsmotion') && !combined.includes('graphsmotion') && !unit.includes('projectile') && !sub.includes('projectile')) return false;
      return true;
    });

    const scored = filtered.map((v:any)=>{
      const caps=norm(v.caps_code||"");
      const top=norm(v.topic||"");
      const unit=norm(v.unit||"");
      const sub=norm(v.subtopic||"");
      const combined=caps+top+unit+sub;
      let score=0;
      // Exact matches on new columns get 100
      if(caps===nTopic || top===nTopic || unit===nTopic || sub===nTopic) score=100;
      else if(unit===nUnit || sub===nTopic) score=100;
      else if(combined.includes(nTopic) || nTopic.includes(combined)) score=90;
      else if(nTopic.includes(caps) || nTopic.includes(top) || nTopic.includes(unit) || nTopic.includes(sub)) score=85;
      else if(caps.includes(nTopic) || top.includes(nTopic) || unit.includes(nTopic) || sub.includes(nTopic)) score=85;
      else if(nUnit && (unit.includes(nUnit) || sub.includes(nUnit) || combined.includes(nUnit))) score=80;
      else if(caps.slice(0,4)===nTopic.slice(0,4) && caps.length>3) score=60;
      else if(unit.slice(0,4)===nUnit.slice(0,4) && unit.length>3) score=60;
      return {...v, _score:score};
    }).filter((v:any)=>v._score>=40).sort((a:any,b:any)=>b._score-a._score);

    const uniq=new Map(); scored.forEach((v:any)=>{ if(!uniq.has(v.id)) uniq.set(v.id,v); });
    let finalVids = [...uniq.values()];
    
    // FALLBACK: If still 0, directly search by unit + subtopic ilike topicId
    if(finalVids.length===0){
      try{
        const rUnit = await fetch(`${url}/rest/v1/videos?select=*&unit=ilike.%${cleanUnitRaw}%&limit=10`,{headers});
        const dUnit:any = await rUnit.json();
        if(Array.isArray(dUnit) && dUnit.length) finalVids = [...finalVids, ...dUnit];
        const rSub = await fetch(`${url}/rest/v1/videos?select=*&subtopic=ilike.%${cleanTopicRaw}%&limit=10`,{headers});
        const dSub:any = await rSub.json();
        if(Array.isArray(dSub) && dSub.length) finalVids = [...finalVids, ...dSub];
      }catch{}
    }

    setVideos(finalVids.slice(0,1));
  })()},[topicId,subjectId,unitId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";
  const ytId = videos[0]? (videos[0].youtube_id || getYoutubeId(videos[0].youtube_url||"")) : "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:"14px",textDecoration:"none"}}>← Back</Link>
        <h1 style={{fontSize:"26px",fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:"10px",color:"#444"}}>DEBUG: unit:{unitId} topic:{topicId} vids:{videos.length} {videos[0]?.unit} / {videos[0]?.subtopic} / {videos[0]?.caps_code} score:{videos[0]?._score} yt:{ytId ? 'yes' : 'no'}</div>
      </div>
      <div style={{display:"flex",gap:"8px",overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"10px 18px",borderRadius:"24px",border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}
      </div>
      {ytId && (
        <div style={{margin:"0 12px 12px"}}>
          <div style={{background:"#000",borderRadius:"24px",overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}>
            <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{width:"100%",height:"100%",border:0}} />
          </div>
        </div>
      )}
      {!ytId && videos.length>0 && <div style={{margin:"0 12px 12px",padding:12,background:"#331111",borderRadius:12,fontSize:12}}>Video found but no youtube_id: {videos[0]?.title} - {videos[0]?.youtube_url}</div>}
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:"24px",border:"1px solid #252a44"}}>
        <div style={{padding:"16px",borderBottom:"1px solid #252a44",display:"flex",gap:"12px",alignItems:"center"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"12px",background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div>
          <div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:12,color:"#6b7280"}}>{videos.length>0 ? `🎥 INCLUDED: ${videos[0]?.unit} / ${videos[0]?.subtopic}` : 'No video'}</div></div>
        </div>
        <div style={{padding:"20px",minHeight:"250px"}}>
          {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {clean}...</div>}
        </div>
      </div>
    </div>
  )
}
