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
  if (!text) return <div style={{color:"#ff6b35"}}>No content</div>;
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
  const [isAdmin, setIsAdmin]=useState(false);
  const [editing, setEditing]=useState(false);
  const [editText, setEditText]=useState("");
  const [saving, setSaving]=useState(false);

  useEffect(()=>{
    if(typeof window!=='undefined'){
      const qs = new URLSearchParams(window.location.search);
      if(qs.get('admin')==='1' || localStorage.getItem('isContentAdmin')==='true') setIsAdmin(true);
    }
  },[]);

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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

    let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&subject=eq.${subjNorm}&caps_code=eq.${cleanTopic}&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let kbArr:any = await resKb.json();
    if(!Array.isArray(kbArr) || kbArr.length===0){
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&caps_code=eq.${cleanTopic}&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      kbArr = await resKb.json();
    }
    if(!Array.isArray(kbArr) || kbArr.length===0){
      const keyword = cleanTopicRaw.includes('doppler')? 'doppler' : cleanTopicRaw.includes('projectile')? 'projectile' : cleanTopicRaw.split('-')[0];
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&subject=eq.${subjNorm}&topic=ilike.%${keyword}%&limit=5`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const fuzzy:any = await resKb.json();
      if(Array.isArray(fuzzy) && fuzzy.length>0) kbArr=[fuzzy[0]];
    }
    if(!Array.isArray(kbArr) || kbArr.length===0) return;
    const kb = kbArr[0];
    const res = await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let nodes:any = await res.json();
    if(!Array.isArray(nodes)) return;
    const seen=new Set();
    nodes = nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
    const mapped = nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type}));
    setRows(mapped);

    try {
      // RULE 1: Subject must match - maths only under maths, physics under physics
      let allRes = await fetch(`${url}/rest/v1/videos?select=*&subject=eq.${subjNorm}&limit=500`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      let all:any = await allRes.json();
      if(!Array.isArray(all) || all.length===0){
        // Fallback if subject column has different casing like "Physical Sciences"
        let r2 = await fetch(`${url}/rest/v1/videos?select=*&limit=500`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
        let all2:any = await r2.json();
        if(Array.isArray(all2)) all = all2.filter((v:any)=> (v.subject||'').toLowerCase().includes(subjNorm.split('-')[0]) );
      }
      if(!Array.isArray(all)) all = [];

      const getScore = (target:string, candidate:string) => {
        if(!target || !candidate) return 0;
        const t = target.toLowerCase().replace(/[-_]/g,' ').replace(/[^a-z0-9 ]/g,'').split(/\s+/).filter(Boolean);
        const c = candidate.toLowerCase().replace(/[-_]/g,' ').replace(/[^a-z0-9 ]/g,'').split(/\s+/).filter(Boolean);
        if(!t.length || !c.length) return 0;
        if(t.join(' ') === c.join(' ')) return 100;
        if(c.join(' ').includes(t.join(' ')) || t.join(' ').includes(c.join(' '))) return 90;
        let common = 0;
        t.forEach(w=>{ if(c.includes(w) || c.some(cw=> cw.includes(w) || w.includes(cw) && w.length>3)) common++; });
        return Math.round((common / Math.max(t.length, c.length)) * 80);
      };

      // RULE 3: Unit relevance is primary filter
      const unitWords = cleanUnitRaw.split('-').filter((w:string)=> w.length>2);
      const targetSlug = kb.caps_code || cleanTopic || cleanTopicRaw;
      
      // Direct links first (most accurate)
      let direct:any[] = [];
      let r1 = await fetch(`${url}/rest/v1/videos?select=*&caps_code=eq.${cleanTopic}&subject=eq.${subjNorm}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      let d1:any = await r1.json(); if(Array.isArray(d1)) direct=[...direct,...d1];
      let r2 = await fetch(`${url}/rest/v1/videos?select=*&caps_code=eq.${cleanTopicRaw}&subject=eq.${subjNorm}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      let d2:any = await r2.json(); if(Array.isArray(d2)) direct=[...direct,...d2];
      let r3b = await fetch(`${url}/rest/v1/videos?select=*&caps_code=eq.${kb.caps_code}&subject=eq.${subjNorm}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      let d3b:any = await r3b.json(); if(Array.isArray(d3b)) direct=[...direct,...d3b];
      if(mapped.length){
        const ids = mapped.map((n:any)=>n.id).join(',');
        let r3 = await fetch(`${url}/rest/v1/videos?select=*&lesson_node_id=in.(${ids})`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
        let d3:any = await r3.json(); if(Array.isArray(d3)) direct=[...direct,...d3];
      }
      let r4 = await fetch(`${url}/rest/v1/videos?select=*&caps_topic_id=eq.${kb.id}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      let d4:any = await r4.json(); if(Array.isArray(d4)) direct=[...direct,...d4];

      // RULE 2 & 3: Fuzzy but must pass unit relevance
      const scored = all.map((v:any)=>{
        const caps = (v.caps_code||'').toLowerCase();
        const topic = (v.topic||'').toLowerCase();
        
        // Unit check - does video belong to this unit?
        let unitScore = 0;
        unitWords.forEach((uw:string)=>{
          if(caps.includes(uw) || topic.includes(uw)) unitScore += 30;
        });
        // Special: doppler unit should only get doppler videos, vertical-projectile only projectile
        if(cleanUnitRaw.includes('doppler') && !(caps.includes('doppler') || topic.includes('doppler'))) unitScore = -100;
        if(cleanUnitRaw.includes('projectile') && !(caps.includes('projectile') || topic.includes('projectile') || caps.includes('equations-motion') || caps.includes('graphs-motion'))) unitScore = -100;
        if(cleanUnitRaw.includes('waves') && !(caps.includes('wave') || caps.includes('sound') || caps.includes('light') || caps.includes('doppler') || topic.includes('wave'))) unitScore = -50;

        const s1 = getScore(targetSlug, v.caps_code || '');
        const s2 = getScore(targetSlug, v.topic || '');
        const s3 = getScore(cleanTopicRaw, v.caps_code || '');
        const s4 = getScore(cleanTopicRaw, v.topic || '');
        const topicScore = Math.max(s1,s2,s3,s4);
        
        return {...v, _score: topicScore + unitScore, _unitScore: unitScore, _topicScore: topicScore};
      }).filter((v:any)=> v._unitScore >= 0 && v._score >= 40).sort((a:any,b:any)=> b._score - a._score);

      const merged = [...direct, ...scored];
      const uniqMap = new Map();
      merged.forEach((v:any)=>{ if(!uniqMap.has(v.id)) uniqMap.set(v.id, v); });
      let uniq = Array.from(uniqMap.values());

      // RULE 2 & 4: Max 3 nodes per topic, but we show only 1 video per topic page (not per node)
      // So limit to top 1 most relevant video for this topic
      if(uniq.length > 3) uniq = uniq.slice(0,3);
      
      setVideos(uniq);
    } catch(e){ setVideos([]); }
  })()},[topicId, subjectId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";
  // RULE 2: Show only 1 video per topic, same across A-E nodes, not duplicated
  const videoForActive = videos[0] || null;
  let ytIdFromVideos = videoForActive? (videoForActive.youtube_id || getYoutubeId(videoForActive.youtube_url||"")) : "";
  const ytIdFromNode = (() => { try { let c = activeNode?.content; if (typeof c === 'string') c = JSON.parse(c); return c?.youtubeId || c?.youtube_id || "" } catch { return "" } })();
  const ytId = ytIdFromVideos || ytIdFromNode || "";
  const startEdit = ()=>{ setEditText(getContent(activeNode)); setEditing(true); };
  const saveEdit = async()=>{
    if(!activeNode) return; setSaving(true);
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    try{
      const res = await fetch(`${url}/rest/v1/lesson_nodes?id=eq.${activeNode.id}`,{ method:"PATCH", headers:{ apikey:key, Authorization:`Bearer ${key}`, "Content-Type":"application/json", Prefer:"return=representation" }, body: JSON.stringify({ content: {...(typeof activeNode.content==='object'? activeNode.content:{}), body_markdown: editText }, body_markdown: editText }) });
      const data = await res.json();
      if(Array.isArray(data) && data.length>0){ setRows(prev=> prev.map(r=> r.id===activeNode.id? {...r, content:{...r.content, body_markdown: editText}, body_markdown: editText} : r)); setEditing(false); alert("Saved!"); }else{ alert("Save blocked: "+JSON.stringify(data)); }
    }catch(e:any){ alert("Error: "+e.message); } setSaving(false);
  };

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:"14px",textDecoration:"none"}}>← Back</Link>
          {isAdmin? <span style={{fontSize:"10px",background:"#00ff88",color:"#000",padding:"4px 8px",borderRadius:"8px",fontWeight:800}}>ADMIN</span> : null}
        </div>
        <h1 style={{fontSize:"26px",fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:"12px",color:rows.length?"#00ff88":"#ff6b35"}}>🔒 {rows.length} NODES {videos.length>0? `• 🎥 ${videos[0]?.caps_code} (${videos[0]?._score}%)`:"• No video yet - unit has no video"}</div>
      </div>
      <div style={{display:"flex",gap:"8px",overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>{setActive(k); setEditing(false);}} style={{flexShrink:0,padding:"10px 18px",borderRadius:"24px",border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}
      </div>
      {ytId && (
        <div style={{margin:"0 12px 12px"}}>
          <div style={{background:"#000",borderRadius:"24px",overflow:"hidden",aspectRatio:"16/9",border:"1px solid #252a44"}}>
            <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}?vq=hd1080&modestbranding=1&rel=0`} title={videoForActive?.title || clean} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen style={{width:"100%",height:"100%",border:0}} />
          </div>
          {videos.length>1 && <div style={{fontSize:10,color:"#6b7280",marginTop:6}}> + {videos.length-1} more related in this unit</div>}
        </div>
      )}
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:"24px",border:"1px solid #252a44"}}>
        <div style={{padding:"16px",borderBottom:"1px solid #252a44",display:"flex",gap:"12px",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
            <div style={{width:"44px",height:"44px",borderRadius:"12px",background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div>
            <div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:"11px",color:"#6b7280"}}>{activeNode?.node_type} • {videos.length} video{videos.length!==1?'s':''} for this subtopic</div></div>
          </div>
          {isAdmin &&!editing && <button onClick={startEdit} style={{background:"#ff6b35",color:"#fff",border:"none",padding:"8px 14px",borderRadius:"12px",fontWeight:700,fontSize:"12px"}}>Quick Edit</button>}
        </div>
        <div style={{padding:"20px",minHeight:"250px"}}>
          {!editing? ( activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {clean}...</div> ) : (
            <div><textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{width:"100%",minHeight:"320px",background:"#0e0f1a",color:"#e5e7eb",border:"1px solid #ff6b35",borderRadius:"12px",padding:"12px",fontSize:"14px",fontFamily:"monospace"}} /><div style={{display:"flex",gap:"8px",marginTop:"12px"}}><button onClick={saveEdit} disabled={saving} style={{flex:1,background:saving?"#555":"#00ff88",color:"#000",border:"none",padding:"12px",borderRadius:"12px",fontWeight:800}}>{saving? "Saving...":"Save"}</button><button onClick={()=>setEditing(false)} style={{flex:1,background:"#252a44",color:"#fff",border:"none",padding:"12px",borderRadius:"12px"}}>Cancel</button></div></div>
          )}
        </div>
      </div>
    </div>
  )
}
