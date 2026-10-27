"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const META:any = { A:{label:"Exam Hook", icon:"📌", color:"#ff6b35"}, B:{label:"Learn The Concept", icon:"📚", color:"#3b82f6"}, C:{label:"Worked Example", icon:"📝", color:"#10b981"}, D:{label:"Examiner Traps", icon:"⚠️", color:"#f59e0b"}, E:{label:"Exam Challenge", icon:"🏆", color:"#8b5cf6"}, };
const TYPE_TO_LABEL:any = { EXAM_HOOK:"A", CONCEPT:"B", LEARN_THE_CONCEPT:"B", WORKED_EXAMPLE:"C", EXAMINER_TRAPS:"D", TRAPS:"D", EXAM_CHALLENGE:"E" };
function MathRenderer({ text }: { text: string }) { if (!text) return <div style={{color:"#888"}}>No content</div>; const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs; const parts = text.split(regex); const html = parts.map(part=>{ if(!part) return ''; const isBlock = (part.startsWith('\\[')&&part.endsWith('\\]')) || (part.startsWith('$$')&&part.endsWith('$$')); const isInline = (part.startsWith('\\(')&&part.endsWith('\\)')) || (part.startsWith('$')&&part.endsWith('$')&&part.length>2); if(isBlock||isInline){ let math = part.slice(2,-2); if(part.startsWith('$')&&!part.startsWith('$$')) math=part.slice(1,-1); try{ return katex.renderToString(math,{displayMode:isBlock,throwOnError:false}) }catch{return part} } return part.replace(/\*\*(.*?)\*\*/g,'<b style="color:#fff">$1</b>').replace(/\n/g,'<br/>'); }).join(''); return <div dangerouslySetInnerHTML={{__html:html}} style={{lineHeight:'1.9',fontSize:'15px',color:'#e5e7eb'}} /> }
function getYoutubeId(url:string){ if(!url) return ""; const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1] : url; }

export default function Page(){
  const p = useParams() as any;
  const subjectId=p?.id, unitId=p?.unitId, topicId=p?.topicId;
  const [rows, setRows] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [active, setActive]=useState("A");
  const [debug, setDebug]=useState("");

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`};
    
    const slug = decodeURIComponent(topicId||""); // arithmetic-sequences
    const keyword = slug.replace(/-/g," "); // arithmetic sequences
    const keywordFirst = keyword.split(" ")[0]+" "+keyword.split(" ")[1]; // arithmetic sequences (first 2 words)
    setDebug(`Searching for: ${keyword}`);

    const cleanTopicRaw = slug.toLowerCase().trim();
    const sid = (subjectId as string).toLowerCase().includes('math')? 'mathematics' : 'physical-sciences';
    let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code&caps_code=eq.${cleanTopicRaw}&limit=1`,{headers}); 
    let kbArr:any = await resKb.json();
    if(!Array.isArray(kbArr)||kbArr.length===0){ 
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code&topic=ilike.%${keywordFirst}%&limit=1`,{headers}); 
      kbArr = await resKb.json(); 
    }
    if(Array.isArray(kbArr)&&kbArr.length>0){ 
      const kb=kbArr[0]; 
      const res=await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers}); 
      let nodes:any=await res.json(); 
      if(Array.isArray(nodes)){ 
        const seen=new Set(); 
        nodes=nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
        setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type}))); 
      } 
    }

    // === V5 - SEARCH BY SLUG DIRECTLY, NO SUBJECTS_DATA ===
    let finalVids:any[]=[];
    // 1. topic ilike %arithmetic sequences%
    let r = await fetch(`${url}/rest/v1/videos?select=*&topic=ilike.%${encodeURIComponent(keyword)}%&limit=5`,{headers});
    let d:any = await r.json();
    if(Array.isArray(d) && d.length>0) finalVids = d.filter((v:any)=> v.youtube_id || v.youtube_url);
    // 2. topic ilike %arithmetic%
    if(finalVids.length===0){
      r = await fetch(`${url}/rest/v1/videos?select=*&topic=ilike.%${encodeURIComponent(keywordFirst)}%&limit=5`,{headers});
      d = await r.json();
      if(Array.isArray(d) && d.length>0) finalVids = d.filter((v:any)=> v.youtube_id || v.youtube_url);
    }
    // 3. title ilike search (your titles have Arithmetic sequences)
    if(finalVids.length===0){
      r = await fetch(`${url}/rest/v1/videos?select=*&title=ilike.%${encodeURIComponent(keywordFirst)}%&limit=5`,{headers});
      d = await r.json();
      if(Array.isArray(d) && d.length>0) finalVids = d.filter((v:any)=> v.youtube_id || v.youtube_url);
    }
    // 4. subtopic ilike
    if(finalVids.length===0){
      r = await fetch(`${url}/rest/v1/videos?select=*&subtopic=ilike.%${encodeURIComponent(keyword)}%&limit=5`,{headers});
      d = await r.json();
      if(Array.isArray(d) && d.length>0) finalVids = d.filter((v:any)=> v.youtube_id || v.youtube_url);
    }
    setVideos(finalVids.slice(0,1));
    if(finalVids.length>0) setDebug(`Found: ${finalVids[0].topic} - ${finalVids[0].youtube_id}`);
    else setDebug(`NOT FOUND for "${keyword}" - checked topic/title/subtopic`);
  })()},[topicId,subjectId,unitId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";
  const ytId = videos[0]? (videos[0].youtube_id || getYoutubeId(videos[0].youtube_url||"")) : "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}><Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:"14px",textDecoration:"none"}}>← Back</Link><h1 style={{fontSize:"26px",fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1><div style={{fontSize:11,color:"#666"}}>{debug}</div></div>
      <div style={{display:"flex",gap:"8px",overflowX:"auto",padding:"0 12px 16px"}}>{Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"10px 18px",borderRadius:"24px",border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}</div>
      {ytId ? (
        <div style={{margin:"0 12px 12px"}}>
          <div style={{background:"#000",borderRadius:"24px",overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}>
            <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{width:"100%",height:"100%",border:0}} />
          </div>
        </div>
      ) : <div style={{margin:"0 12px 12px",padding:20,background:"#1a1c2e",borderRadius:12,color:"#f87171",fontSize:13}}>{debug} - No video found. Check RLS policy.</div>}
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:"24px",border:"1px solid #252a44"}}><div style={{padding:"16px",borderBottom:"1px solid #252a44",display:"flex",gap:"12px",alignItems:"center"}}><div style={{width:"44px",height:"44px",borderRadius:"12px",background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div><div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:12,color:"#6b7280"}}>{videos.length>0 ? `🎥 ${videos[0]?.topic}` : debug}</div></div></div><div style={{padding:"20px",minHeight:"250px"}}>{activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {clean}...</div>}</div></div>
    </div>
  )
}
