"use client";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';
import { SUBJECTS_DATA } from "../../../../../../lib/subjects";

const META:any = { A:{label:"Exam Hook", icon:"📌", color:"#ff6b35"}, B:{label:"Learn The Concept", icon:"📚", color:"#3b82f6"}, C:{label:"Worked Example", icon:"📝", color:"#10b981"}, D:{label:"Examiner Traps", icon:"⚠️", color:"#f59e0b"}, E:{label:"Exam Challenge", icon:"🏆", color:"#8b5cf6"}, };
const ORDER = ["A","B","C","D","E"];
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
      let math = part.slice(2,-2); 
      if(part.startsWith('$')&&!part.startsWith('$$')) math=part.slice(1,-1); 
      try{ return katex.renderToString(math,{displayMode:isBlock,throwOnError:false}) }catch{return part} 
    } 
    return part.replace(/\*\*(.*?)\*\*/g,'<b style="color:#fff">$1</b>').replace(/\n/g,'<br/>'); 
  }).join(''); 
  return <div dangerouslySetInnerHTML={{__html:html}} style={{lineHeight:'1.9',fontSize:'15px',color:'#e5e7eb'}} /> 
}

function getYoutubeId(url:string){ if(!url) return ""; const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1] : url; }

function topicSimilarity(a:string,b:string){ 
  const t=a.toLowerCase(); 
  const v=(b||"").toLowerCase(); 
  if(!v) return 0; 
  if(t===v) return 100; 
  if(v.includes(t)||t.includes(v)) return 90; 
  const tw=t.split(/[^a-z0-9]+/).filter(Boolean); 
  const vw=v.split(/[^a-z0-9]+/).filter(Boolean); 
  let c=0; 
  for(const w of tw) if(w.length>3&&vw.includes(w)) c++; 
  return c*10; 
}

export default function Page(){
  const p = useParams() as any;
  const subjectId=p?.id, unitId=p?.unitId, topicId=p?.topicId;
  const [rows, setRows] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [active, setActive]=useState("A");

  const { prevTopic, nextTopic, isLast, unitTopics } = useMemo(()=>{
    let sid = subjectId as string; if(sid==="physical-science") sid="physical-sciences";
    const subj = (SUBJECTS_DATA as any)[sid];
    if(!subj?.sections) return {prevTopic:null,nextTopic:null,isLast:false,unitTopics:[]};
    for(const sec of subj.sections){
      for(const u of sec.units||[]){
        if(u.id===unitId){
          const idx = u.topics.findIndex((t:any)=>t.id===topicId);
          if(idx>=0) return {prevTopic: idx>0?u.topics[idx-1]:null, nextTopic: idx<u.topics.length-1?u.topics[idx+1]:null, isLast: idx===u.topics.length-1, unitTopics: u.topics};
        }
      }
    }
    return {prevTopic:null,nextTopic:null,isLast:false,unitTopics:[]};
  },[subjectId,unitId,topicId]);

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`};
    const topicSlug = decodeURIComponent(topicId||"");
    const unitSlug = decodeURIComponent(unitId||"");
    const unitKeyword = unitSlug.replace(/-/g," ").toLowerCase();

    let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id&caps_code=eq.${topicSlug.toLowerCase()}&limit=1`,{headers}); 
    let kbArr:any = await resKb.json().catch(()=>[]);
    if(!Array.isArray(kbArr)||kbArr.length===0){
      const fw=topicSlug.replace(/-/g," ").split(" ")[0].toLowerCase();
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id&topic=ilike.${fw}%&limit=1`,{headers});
      kbArr = await resKb.json().catch(()=>[]);
    }
    if(Array.isArray(kbArr)&&kbArr.length>0){
      const res=await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kbArr[0].id}&order=node_type.asc`,{headers});
      let nodes:any=await res.json().catch(()=>[]);
      if(Array.isArray(nodes)){
        const seen=new Set(); nodes=nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
        setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
      }
    }

    // V10 FETCH LOCKED - 80 videos manual allocation
    let r = await fetch(`${url}/rest/v1/videos?select=*&limit=100`,{headers});
    let allVideos:any = await r.json().catch(()=>[]);
    if(!Array.isArray(allVideos)) allVideos=[];
    allVideos = allVideos.filter((v:any)=> v.youtube_id || v.youtube_url);
    let unitFiltered = allVideos.filter((v:any)=> v.unit && (v.unit.toLowerCase().trim() === unitKeyword.trim() || v.unit.toLowerCase().includes(unitKeyword) || unitKeyword.includes(v.unit.toLowerCase())));
    if(unitFiltered.length===0) unitFiltered = allVideos.filter((v:any)=> v.unit && v.unit.toLowerCase().includes(unitKeyword.substring(0,6)));

    // ALLOCATION: All videos must appear, max 2 times, closest topic first
    if(unitFiltered.length>0 && unitTopics.length>0){
      const usage = new Array(unitFiltered.length).fill(0);
      const allocation: number[] = new Array(unitTopics.length).fill(-1);
      for(let i=0;i<unitTopics.length;i++){
        let best=-1; let bestScore=-1;
        for(let j=0;j<unitFiltered.length;j++){
          if(usage[j]>=2) continue;
          const sc = topicSimilarity(unitTopics[i].title||unitTopics[i].id, unitFiltered[j].topic) - usage[j]*0.1;
          if(sc>bestScore){ bestScore=sc; best=j; }
        }
        if(best===-1){ let min=Math.min(...usage); best=usage.findIndex((u:any)=>u===min); }
        if(best>=0){ allocation[i]=best; usage[best]++; }
      }
      const cur = unitTopics.findIndex((t:any)=>t.id===topicId);
      const chosen = allocation[cur>=0?cur:0];
      if(chosen>=0) setVideos([unitFiltered[chosen]]);
    }
  })()},[topicId,subjectId,unitId,unitTopics]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || "";
  const currentVid = videos[0];
  const ytId = currentVid? (currentVid.youtube_id || getYoutubeId(currentVid.youtube_url||"")) : "";
  const activeIdx = ORDER.indexOf(active);
  const hasNextNode = activeIdx < ORDER.length-1;
  const hasPrevNode = activeIdx > 0;

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:20}}>
      <div style={{padding:"12px 16px 8px"}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:14,textDecoration:"none"}}>← Back to Unit</Link>
        <h1 style={{fontSize:26,fontWeight:900,margin:"8px 0 0",textTransform:"capitalize"}}>{clean}</h1>
      </div>

      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 12px 12px"}}>
        {ORDER.map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"8px 16px",borderRadius:24,border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500,fontSize:13}}>{META[k].icon} {k}</button>)}
      </div>

      {ytId ? (<div style={{margin:"0 12px 12px"}}><div style={{background:"#000",borderRadius:20,overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}><iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{width:"100%",height:"100%",border:0}} /></div></div>) : null}

      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:20,border:"1px solid #252a44"}}>
        <div style={{padding:14,borderBottom:"1px solid #252a44",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:40,height:40,borderRadius:10,background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div>
          <div><div style={{fontWeight:800,fontSize:14}}>Node {active} • {meta?.label}</div></div>
        </div>
        <div style={{padding:16}}>{activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888",fontSize:14}}>Loading...</div>}</div>
      </div>

      <div style={{margin:"16px 12px 0",display:"flex",gap:10}}>
        {hasPrevNode ? (
          <button onClick={()=>{ setActive(ORDER[activeIdx-1]); window.scrollTo({top:0,behavior:"smooth"}); }} style={{flex:1,padding:"14px",borderRadius:14,border:"1px solid #252a44",background:"#1a1c2e",color:"#fff",fontWeight:600}}>← {ORDER[activeIdx-1]}</button>
        ) : prevTopic ? (
          <Link href={`/subjects/${subjectId}/${unitId}/${prevTopic.id}`} style={{flex:1,textDecoration:"none",padding:"14px",borderRadius:14,border:"1px solid #252a44",background:"#1a1c2e",color:"#fff",fontWeight:600,textAlign:"center",display:"block"}}>← Previous Topic</Link>
        ) : <div style={{flex:1}}/>}

        {hasNextNode ? (
          <button onClick={()=>{ setActive(ORDER[activeIdx+1]); window.scrollTo({top:0,behavior:"smooth"}); }} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:700}}>Next: {ORDER[activeIdx+1]} →</button>
        ) : nextTopic ? (
          <Link href={`/subjects/${subjectId}/${unitId}/${nextTopic.id}`} style={{flex:1,textDecoration:"none",padding:"14px",borderRadius:14,border:"none",background:"#fff",color:"#000",fontWeight:700,textAlign:"center",display:"block"}}>Next Topic →</Link>
        ) : (
          <Link href={`/subjects/${subjectId}/${unitId}`} style={{flex:1,textDecoration:"none",padding:"14px",borderRadius:14,border:"none",background:"#10b981",color:"#000",fontWeight:800,textAlign:"center",display:"block"}}>Finish Topic ✓</Link>
        )}
      </div>
    </div>
  )
}
