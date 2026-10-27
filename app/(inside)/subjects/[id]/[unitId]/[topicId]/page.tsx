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
  const [debug, setDebug]=useState("Loading videos...");

  useEffect(()=>{(async()=>{
    try{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const headers:any={apikey:key,Authorization:`Bearer ${key}`};
      
      const topicSlug = decodeURIComponent(topicId||"");
      const unitSlug = decodeURIComponent(unitId||"");
      const topicKeyword = topicSlug.replace(/-/g," ").toLowerCase();
      const unitKeyword = unitSlug.replace(/-/g," ").toLowerCase();

      // KB
      let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id&caps_code=eq.${topicSlug.toLowerCase()}&limit=1`,{headers}); 
      let kbArr:any = await resKb.json().catch(()=>[]);
      if(!Array.isArray(kbArr)||kbArr.length===0){
        resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id&topic=ilike.${topicKeyword.split(" ")[0]}%&limit=1`,{headers});
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

      // GET UNIT TOPICS ORDER
      const subj = (SUBJECTS_DATA as any)[subjectId==="physical-science"?"physical-sciences":subjectId];
      let currentIdx=0;
      if(subj?.sections){
        for(const sec of subj.sections){
          const u=sec.units?.find((x:any)=>x.id===unitId);
          if(u?.topics){ currentIdx=u.topics.findIndex((t:any)=>t.id===topicId); break;}
        }
      }
      if(currentIdx<0) currentIdx=0;

      // *** FIX: Fetch ALL 80 videos once, filter in JS - no ilike.% hang ***
      setDebug("Fetching all videos...");
      let r = await fetch(`${url}/rest/v1/videos?select=*&limit=100`,{headers});
      let allVideos:any = await r.json();
      if(!Array.isArray(allVideos)) throw new Error("videos fetch failed: "+JSON.stringify(allVideos).substring(0,100));
      
      allVideos = allVideos.filter((v:any)=> v.youtube_id || v.youtube_url);
      
      // Filter by unit in JS (case insensitive)
      let unitFiltered = allVideos.filter((v:any)=> v.unit && v.unit.toLowerCase().includes(unitKeyword.substring(0,6)) || unitKeyword.includes(v.unit?.toLowerCase().substring(0,6)) || v.unit?.toLowerCase() === unitKeyword);
      
      // Better: exact unit match ignoring case
      if(unitFiltered.length===0){
        unitFiltered = allVideos.filter((v:any)=> v.unit && (v.unit.toLowerCase().trim() === unitKeyword.trim() || v.unit.toLowerCase().includes(unitKeyword) || unitKeyword.includes(v.unit.toLowerCase())));
      }

      // Also try topic match
      let topicFiltered = allVideos.filter((v:any)=> v.topic && v.topic.toLowerCase().includes(topicKeyword));

      if(topicFiltered.length>0){
        setVideos([topicFiltered[0]]);
        setDebug(`Found by topic: ${topicFiltered[0].topic} / ${topicFiltered[0].unit} - ${topicFiltered[0].youtube_id}`);
      } else if(unitFiltered.length>0){
        // YOUR RULE: Distribute by topic index
        const distributed = unitFiltered[currentIdx % unitFiltered.length];
        setVideos([distributed]);
        setDebug(`No topic match for "${topicKeyword}" → Unit "${unitKeyword}" has ${unitFiltered.length} videos. Topic #${currentIdx+1} gets: ${distributed.topic} - ${distributed.youtube_id}`);
      } else {
        setDebug(`NO VIDEOS. Total videos fetched: ${allVideos.length}. Units found: ${[...new Set(allVideos.map((v:any)=>v.unit))].slice(0,5).join(", ")}`);
      }
    }catch(e:any){
      setDebug("ERROR: "+ (e.message||e));
    }
  })()},[topicId,subjectId,unitId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || "";
  const currentVid = videos[0];
  const ytId = currentVid? (currentVid.youtube_id || getYoutubeId(currentVid.youtube_url||"")) : "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}><Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:14,textDecoration:"none"}}>← Back</Link><h1 style={{fontSize:26,fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1><div style={{fontSize:11,color:"#fbbf24",background:"#1f1a0e",padding:8,borderRadius:8,wordBreak:"break-all"}}>{debug}</div></div>
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 12px 16px"}}>{Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"10px 18px",borderRadius:24,border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}</div>
      {ytId ? (<div style={{margin:"0 12px 12px"}}><div style={{background:"#000",borderRadius:24,overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}><iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}`} frameBorder="0" allowFullScreen style={{width:"100%",height:"100%",border:0}} /></div><div style={{marginTop:8,fontSize:11,color:"#888"}}>{currentVid.unit} / {currentVid.topic}</div></div>) : <div style={{margin:"0 12px",padding:12}}><div style={{color:"#f87171",fontSize:12}}>{debug.includes("ERROR")?debug:""}</div></div>}
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:24,border:"1px solid #252a44"}}><div style={{padding:16,borderBottom:"1px solid #252a44",display:"flex",gap:12,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:12,background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div><div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div></div></div><div style={{padding:20,minHeight:250}}>{activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading concept...</div>}</div></div>
    </div>
  )
}
