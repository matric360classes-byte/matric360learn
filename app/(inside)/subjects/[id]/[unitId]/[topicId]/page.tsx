"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { SUBJECTS_DATA } from "../../../../../../lib/subjects";

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
    
    const topicSlug = decodeURIComponent(topicId||"");
    const unitSlug = decodeURIComponent(unitId||"");
    const topicKeyword = topicSlug.replace(/-/g," ");
    const unitKeyword = unitSlug.replace(/-/g," ");

    // GET TOPICS ORDER FOR THIS UNIT FROM SUBJECTS_DATA
    let sid = subjectId as string; if(sid==="physical-science") sid="physical-sciences";
    const subj = (SUBJECTS_DATA as any)[sid];
    let unitTopics:any[] = [];
    let currentTopicIndex = 0;
    if(subj?.sections){
      for(const sec of subj.sections){
        const u = sec.units?.find((x:any)=> x.id===unitId);
        if(u && u.topics){ unitTopics = u.topics; currentTopicIndex = u.topics.findIndex((t:any)=> t.id===topicId); break; }
      }
    }
    if(unitTopics.length===0){
      const allUnits:any[]=[]; subj?.sections?.forEach((sec:any)=> sec.units?.forEach((u:any)=> allUnits.push(u))); if(subj?.units) allUnits.push(...subj.units);
      const found=allUnits.find((u:any)=> u.id===unitId);
      if(found?.topics){ unitTopics = found.topics; currentTopicIndex = found.topics.findIndex((t:any)=> t.id===topicId); }
    }
    if(currentTopicIndex<0) currentTopicIndex=0;

    // KB
    const cleanTopicRaw = topicSlug.toLowerCase().trim();
    let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code&caps_code=eq.${cleanTopicRaw}&limit=1`,{headers}); 
    let kbArr:any = await resKb.json();
    if(!Array.isArray(kbArr)||kbArr.length===0){ const kw=topicKeyword.split(" ")[0]; resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code&topic=ilike.%${kw}%&limit=1`,{headers}); kbArr = await resKb.json(); }
    if(Array.isArray(kbArr)&&kbArr.length>0){ const kb=kbArr[0]; const res=await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers}); let nodes:any=await res.json(); if(Array.isArray(nodes)){ const seen=new Set(); nodes=nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;}); setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type}))); } }

    let finalVids:any[]=[]; let allUnitVids:any[]=[]; let r,d:any;

    // 1. Try exact topic match first
    r = await fetch(`${url}/rest/v1/videos?select=*&topic=ilike.%${encodeURIComponent(topicKeyword)}%&limit=10`,{headers});
    d = await r.json(); if(Array.isArray(d)&&d.length>0) finalVids = d.filter((v:any)=> v.youtube_id || v.youtube_url);

    // 2. Get ALL videos for this Unit
    r = await fetch(`${url}/rest/v1/videos?select=*&unit=ilike.%${encodeURIComponent(unitKeyword)}%&order=created_at.asc&limit=30`,{headers});
    d = await r.json(); if(Array.isArray(d)&&d.length>0) allUnitVids = d.filter((v:any)=> v.youtube_id || v.youtube_url);

    if(finalVids.length>0){
      // Found closest topic match
      setVideos(finalVids.slice(0,1));
      setDebug(`Closest topic match: ${finalVids[0].topic}`);
    } else if(allUnitVids.length>0){
      // NO closest topic → DISTRIBUTE by topic index inside Unit
      // Example: Unit has 4 topics, 4 videos → topic index 0 gets video 0, index 1 gets video 1, etc.
      const distributedVideo = allUnitVids[currentTopicIndex % allUnitVids.length];
      setVideos([distributedVideo]);
      setDebug(`No exact topic for "${topicKeyword}" → Allocated Video ${currentTopicIndex+1}/${allUnitVids.length} from Unit "${unitKeyword}" to topic #${currentTopicIndex+1} (${unitTopics[currentTopicIndex]?.title||topicKeyword}) - ${distributedVideo.youtube_id}`);
    } else {
      setVideos([]);
      setDebug(`No videos for Unit "${unitKeyword}"`);
    }
  })()},[topicId,subjectId,unitId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";
  const currentVid = videos[0];
  const ytId = currentVid? (currentVid.youtube_id || getYoutubeId(currentVid.youtube_url||"")) : "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}><Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:"14px",textDecoration:"none"}}>← Back</Link><h1 style={{fontSize:"26px",fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1><div style={{fontSize:11,color:"#888"}}>{debug}</div></div>
      <div style={{display:"flex",gap:"8px",overflowX:"auto",padding:"0 12px 16px"}}>{Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"10px 18px",borderRadius:"24px",border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}</div>
      {ytId ? (<div style={{margin:"0 12px 12px"}}><div style={{background:"#000",borderRadius:"24px",overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}><iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{width:"100%",height:"100%",border:0}} /></div><div style={{marginTop:8,fontSize:11,color:"#666"}}>Unit: {currentVid?.unit} | Topic: {currentVid?.topic} | {ytId}</div></div>) : <div style={{margin:"0 12px 12px",padding:16,background:"#1a1c2e",borderRadius:12,color:"#f87171",fontSize:12}}>{debug}</div>}
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:"24px",border:"1px solid #252a44"}}><div style={{padding:"16px",borderBottom:"1px solid #252a44",display:"flex",gap:"12px",alignItems:"center"}}><div style={{width:"44px",height:"44px",borderRadius:"12px",background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div><div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:12,color:"#6b7280"}}>{videos.length>0 ? `🎥 Allocated from Unit` : debug}</div></div></div><div style={{padding:"20px",minHeight:"250px"}}>{activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {clean}...</div>}</div></div>
    </div>
  )
}
