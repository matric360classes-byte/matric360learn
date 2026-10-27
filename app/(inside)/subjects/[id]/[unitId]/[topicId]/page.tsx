"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { SUBJECTS_DATA } from "../../../../../../lib/subjects";

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
function getYoutubeId(url:string){ if(!url) return ""; const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1] : url; }

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
    
    let sid = subjectId as string;
    if(sid==="physical-science") sid="physical-sciences";
    const subj = (SUBJECTS_DATA as any)[sid];
    let exactUnitTitle = "";
    let exactTopicTitle = "";
    if(subj?.sections){
      for(const sec of subj.sections){
        const u = sec.units?.find((x:any)=> x.id===unitId);
        if(u){ exactUnitTitle = u.title; const t = u.topics?.find((x:any)=> x.id===topicId); if(t) exactTopicTitle = t.title; break; }
      }
    }
    if(!exactUnitTitle){
      const allUnits:any[] = [];
      subj?.sections?.forEach((sec:any)=> sec.units?.forEach((u:any)=> allUnits.push(u)));
      if(subj?.units) allUnits.push(...subj.units);
      const found = allUnits.find((u:any)=> u.id===unitId);
      if(found){ exactUnitTitle = found.title; const foundTopic = found.topics?.find((t:any)=> t.id===topicId); if(foundTopic) exactTopicTitle = foundTopic.title; }
    }

    const cleanTopicRaw = decodeURIComponent(topicId||"").toLowerCase().trim();
    const subjNorm = sid.toLowerCase().includes('math')? 'mathematics' : 'physical-sciences';
    let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code&caps_code=eq.${cleanTopicRaw}&limit=1`,{headers});
    let kbArr:any = await resKb.json();
    if(!Array.isArray(kbArr)||kbArr.length===0){
      const kw=cleanTopicRaw.split('-')[0];
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,subject&subject=eq.${subjNorm}&topic=ilike.%${kw}%&limit=1`,{headers});
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

    // FINAL 80 - YOUR ALLOCATION - unit + topic EXACT MATCH
    let finalVids:any[] = [];
    if(exactUnitTitle && exactTopicTitle){
      const r1 = await fetch(`${url}/rest/v1/videos?select=*&unit=eq.${encodeURIComponent(exactUnitTitle)}&topic=eq.${encodeURIComponent(exactTopicTitle)}&limit=5`,{headers});
      const d1:any = await r1.json();
      if(Array.isArray(d1) && d1.length>0){
        finalVids = d1.filter((v:any)=> v.youtube_id || v.youtube_url);
      }
      if(finalVids.length===0){
        const r2 = await fetch(`${url}/rest/v1/videos?select=*&unit=ilike.${encodeURIComponent(exactUnitTitle)}&topic=ilike.${encodeURIComponent(exactTopicTitle)}&limit=5`,{headers});
        const d2:any = await r2.json();
        if(Array.isArray(d2) && d2.length>0){
          finalVids = d2.filter((v:any)=> v.youtube_id || v.youtube_url);
        }
      }
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
      </div>
      <div style={{display:"flex",gap:"8px",overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"10px 18px",borderRadius:"24px",border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}
      </div>
      {ytId ? (
        <div style={{margin:"0 12px 12px"}}>
          <div style={{background:"#000",borderRadius:"24px",overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}>
            <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{width:"100%",height:"100%",border:0}} />
          </div>
        </div>
      ) : null}
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:"24px",border:"1px solid #252a44"}}>
        <div style={{padding:"16px",borderBottom:"1px solid #252a44",display:"flex",gap:"12px",alignItems:"center"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"12px",background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div>
          <div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:12,color:"#6b7280"}}>{videos.length>0 ? `🎥 ${videos[0]?.unit} / ${videos[0]?.topic}` : 'No video in 80 for this topic'}</div></div>
        </div>
        <div style={{padding:"20px",minHeight:"250px"}}>
          {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {clean}...</div>}
        </div>
      </div>
    </div>
  )
}
