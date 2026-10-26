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
const norm = (s:string)=> (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");

function MathRenderer({ text }: { text: string }) {
  if (!text) return <div style={{color:"#888",padding:20}}>No content</div>;
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
  const [loading, setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`};
    const cleanTopicRaw = decodeURIComponent(topicId||"").toLowerCase().trim();
    const cleanUnitRaw = decodeURIComponent(unitId||"").toLowerCase().trim();
    const cleanSubjectRaw = decodeURIComponent(subjectId||"").toLowerCase().trim();
    const subjNorm = cleanSubjectRaw.includes('math')? 'mathematics' : cleanSubjectRaw.includes('physical')? 'physical-sciences' : cleanSubjectRaw;
    const ALIAS:any = {
      "equations": subjNorm==='physical-sciences'? "equations-motion" : "equations",
      "equation": subjNorm==='physical-sciences'? "equations-motion" : "equations",
      "equations-of-motion": "equations-motion",
      "graphs": "graphs-motion", "graphs-of-motion": "graphs-motion", "graph": "graphs-motion",
      "projectile-calculations": "projectile-calculations", "projectile-calculation": "projectile-calculations", "projectile": "projectile-calculations",
      "doppler-effect-definition": "doppler-definition", "doppler-effect---definition": "doppler-definition", "doppler-definition": "doppler-definition",
      "doppler-equation": "doppler-equation", "doppler-effect": "red-blue", "doppler": "red-blue",
      "red-and-blue-shift": "red-blue", "red-blue-shift": "red-blue"
    };
    const cleanTopic = ALIAS[cleanTopicRaw] || cleanTopicRaw;

    try{
      // --- NODES FETCH - RESTORED WORKING LOGIC ---
      let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&subject=eq.${subjNorm}&caps_code=eq.${cleanTopic}&limit=1`,{headers});
      let kbArr:any = await resKb.json();
      if(!Array.isArray(kbArr) || kbArr.length===0){
        resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&caps_code=eq.${cleanTopic}&limit=1`,{headers});
        kbArr = await resKb.json();
      }
      if(!Array.isArray(kbArr) || kbArr.length===0){
        const keyword = cleanTopicRaw.includes('doppler')? 'doppler' : cleanTopicRaw.includes('projectile')? 'projectile' : cleanTopicRaw.split('-')[0];
        resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&subject=eq.${subjNorm}&topic=ilike.%${keyword}%&limit=5`,{headers});
        const fuzzy:any = await resKb.json();
        if(Array.isArray(fuzzy) && fuzzy.length>0) kbArr=[fuzzy[0]];
      }
      
      let kb:any=null;
      if(Array.isArray(kbArr) && kbArr.length>0){
        kb=kbArr[0];
        const res = await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers});
        let nodes:any = await res.json();
        if(Array.isArray(nodes)){
          const seen=new Set();
          nodes = nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
          setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
        }
      }
      setLoading(false);

      // --- VIDEOS FETCH - SEPARATE, DOES NOT BLOCK NODES ---
      const getScore = (a:string,b:string)=>{
        if(!a||!b) return 0;
        a=norm(a); b=norm(b);
        if(!a||!b) return 0;
        if(a===b) return 100;
        if(b.includes(a) || a.includes(b)) return 85;
        return 0;
      };
      try{
        let allRes = await fetch(`${url}/rest/v1/videos?select=*&subject=eq.${subjNorm}&limit=500`,{headers});
        let all:any = await allRes.json();
        if(!Array.isArray(all)) all=[];
        const targetCode = kb?.caps_code || cleanTopic || cleanTopicRaw;
        const scored = all.map((v:any)=>{
          const s1=getScore(cleanTopicRaw, v.caps_code||'');
          const s2=getScore(cleanTopicRaw, v.topic||'');
          const s3=getScore(targetCode, v.caps_code||'');
          const s4=getScore(targetCode, v.topic||'');
          return {...v, _score: Math.max(s1,s2,s3,s4)};
        }).filter((v:any)=> v._score>=60).sort((a:any,b:any)=> b._score-a._score);
        setVideos(scored.slice(0,1));
      }catch{}

    }catch(e){
      setLoading(false);
    }
  })()},[topicId, subjectId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";
  const videoForActive = videos[0] || null;
  const ytId = videoForActive? (videoForActive.youtube_id || getYoutubeId(videoForActive.youtube_url||"")) : "";

  if(loading) return <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",padding:20}}>Loading {clean}...</div>;

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
          {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>No nodes found for {clean}. Check caps_knowledge_base entry for {cleanTopicRaw}</div>}
        </div>
      </div>
    </div>
  )
}
