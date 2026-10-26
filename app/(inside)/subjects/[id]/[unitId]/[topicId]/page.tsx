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
  if (!text) return null;
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
    const cleanTopicRaw = decodeURIComponent(topicId||"").toLowerCase().trim();
    const cleanUnitRaw = decodeURIComponent(unitId||"").toLowerCase().trim();
    const cleanSubjectRaw = decodeURIComponent(subjectId||"").toLowerCase().trim();
    const subjNorm = cleanSubjectRaw.includes('math')? 'mathematics' : 'physical-sciences';

    // FAST: 1 fetch for KB
    let kbRes = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,caps_code&caps_code=eq.${cleanTopicRaw}&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let kbArr:any = await kbRes.json();
    if(!Array.isArray(kbArr) || kbArr.length===0){
      kbRes = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,caps_code&topic=ilike.%${cleanTopicRaw.split('-')[0]}%&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      kbArr = await kbRes.json();
    }
    if(!Array.isArray(kbArr) || kbArr.length===0) return;
    const kb = kbArr[0];

    // FAST: Parallel fetches
    const [nodesRes, vidsRes] = await Promise.all([
      fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers:{apikey:key,Authorization:`Bearer ${key}`}}),
      fetch(`${url}/rest/v1/videos?select=*&subject=eq.${subjNorm}&limit=500`,{headers:{apikey:key,Authorization:`Bearer ${key}`}})
    ]);
    
    let nodes:any = await nodesRes.json();
    let all:any = await vidsRes.json();
    if(!Array.isArray(nodes)) nodes=[];
    if(!Array.isArray(all)) all=[];

    const seen=new Set();
    nodes = nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
    setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));

    // RULES: Subject already filtered, Unit relevance, then closest subtopic
    const unitWords = cleanUnitRaw.split('-');
    const getScore = (a:string,b:string)=>{
      if(!a||!b) return 0;
      a=a.toLowerCase(); b=b.toLowerCase();
      if(a===b) return 100;
      if(b.includes(a) || a.includes(b)) return 80;
      const aw=a.split('-'); const bw=b.split('-');
      let c=0; aw.forEach(w=>{ if(w.length>2 && b.includes(w)) c++; });
      return Math.round(c/aw.length*60);
    };

    const filtered = all.filter((v:any)=>{
      const vc=(v.caps_code||'').toLowerCase();
      const vt=(v.topic||'').toLowerCase();
      // Unit must match - prevents doppler in projectile
      if(cleanUnitRaw.includes('doppler') && !vc.includes('doppler') && !vt.includes('doppler')) return false;
      if(cleanUnitRaw.includes('projectile') && !vc.includes('motion') && !vt.includes('projectile')) return false;
      return true;
    });

    const scored = filtered.map((v:any)=>{
      const s1=getScore(cleanTopicRaw, v.caps_code||'');
      const s2=getScore(cleanTopicRaw, v.topic||'');
      const s3=getScore(kb.caps_code||'', v.caps_code||'');
      let unitBonus=0;
      unitWords.forEach((uw:string)=>{ if((v.caps_code||'').toLowerCase().includes(uw)) unitBonus+=5; });
      return {...v, _score: Math.max(s1,s2,s3)+unitBonus};
    }).filter((v:any)=> v._score>=40).sort((a:any,b:any)=> b._score-a._score);

    // Max 1 video per topic page, deduped
    const uniq = Array.from(new Map(scored.map((v:any)=>[v.id,v])).values()).slice(0,1);
    setVideos(uniq as any);
  })()},[topicId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";
  const videoForActive = videos[0] || null;
  const ytId = videoForActive? (videoForActive.youtube_id || getYoutubeId(videoForActive.youtube_url||"")) : "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:"14px",textDecoration:"none"}}>← Back</Link>
        <h1 style={{fontSize:"26px",fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1>
      </div>
      <div style={{display:"flex",gap:"8px",overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"10px 18px",borderRadius:"24px",border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}
      </div>
      {ytId && (
        <div style={{margin:"0 12px 12px"}}>
          <div style={{background:"#000",borderRadius:"24px",overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}>
            <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}?vq=hd1080&modestbranding=1&rel=0`} frameBorder="0" allowFullScreen style={{width:"100%",height:"100%",border:0}} />
          </div>
        </div>
      )}
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:"24px",border:"1px solid #252a44"}}>
        <div style={{padding:"16px",borderBottom:"1px solid #252a44",display:"flex",gap:"12px",alignItems:"center"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"12px",background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div>
          <div><div style={{fontWeight:800}}>{meta?.label}</div></div>
        </div>
        <div style={{padding:"20px",minHeight:"250px"}}>
          {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading...</div>}
        </div>
      </div>
    </div>
  )
}
