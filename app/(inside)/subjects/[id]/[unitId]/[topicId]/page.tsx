"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

export default function Page(){
  const p = useParams() as any;
  const searchParams = useSearchParams();
  const subjectId=p?.id, unitId=p?.unitId, topicId=p?.topicId;
  const [rows,setRows]=useState<any[]>([]);
  const [active,setActive]=useState("A");
  const [isAdmin,setIsAdmin]=useState(false);
  const [editing,setEditing]=useState(false);
  const [editText,setEditText]=useState("");
  const [saving,setSaving]=useState(false);

  // Admin check - only you
  useEffect(()=>{
    if(searchParams.get('admin')==='1' || (typeof window!=='undefined' && localStorage.getItem('isContentAdmin')==='true')){
      setIsAdmin(true);
    }
  },[searchParams]);

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const cleanTopicRaw = decodeURIComponent(topicId||"").toLowerCase().trim();
    const cleanSubjectRaw = decodeURIComponent(subjectId||"").toLowerCase().trim();
    const subjNorm = cleanSubjectRaw.includes('math')? 'mathematics' : cleanSubjectRaw.includes('physical')? 'physical-sciences' : cleanSubjectRaw;

    // FIX: Alias map for list page that builds wrong slugs (graphs instead of graphs-motion etc)
    const ALIAS:any = {
      "equations": subjNorm==='physical-sciences'? "equations-motion" : "equations",
      "equation": subjNorm==='physical-sciences'? "equations-motion" : "equations",
      "equations-of-motion": "equations-motion",
      "graphs": "graphs-motion",
      "graphs-of-motion": "graphs-motion",
      "graph": "graphs-motion",
      "projectile-calculations": "projectile-calculations",
      "projectile-calculation": "projectile-calculations",
      "projectile": "projectile-calculations",
      "free-fall": "free-fall",
      "free": "free-fall",
      "bouncing": "bouncing",
      "doppler-effect-definition": "doppler-definition",
      "doppler-effect---definition": "doppler-definition",
      "doppler-definition": "doppler-definition",
      "doppler-equation": "doppler-equation",
      "doppler-effect": "red-blue",
      "doppler": "red-blue",
      "red-and-blue-shift": "red-blue",
      "red-blue-shift": "red-blue",
      "regression": "regression",
      "regression-and-least-squares": "regression"
    };
    const cleanTopic = ALIAS[cleanTopicRaw] || cleanTopicRaw;

    // 1. EXACT MATCH BY CAPS_CODE + SUBJECT
    let resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&subject=eq.${subjNorm}&caps_code=eq.${cleanTopic}&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let kbArr:any = await resKb.json();

    // 2. Fallback: caps_code exact only (for regression etc)
    if(!Array.isArray(kbArr) || kbArr.length===0){
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&caps_code=eq.${cleanTopic}&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      kbArr = await resKb.json();
    }

    // 3. Fuzzy fallback for 0 NODES: search by topic contains keyword for that subject
    if(!Array.isArray(kbArr) || kbArr.length===0){
      const keyword = cleanTopicRaw.includes('doppler')? 'doppler' : cleanTopicRaw.includes('projectile')? 'projectile' : cleanTopicRaw.includes('graph')? 'graphs' : cleanTopicRaw.split('-')[0];
      resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,subject,caps_code&subject=eq.${subjNorm}&topic=ilike.%${keyword}%&limit=5`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const fuzzy:any = await resKb.json();
      if(Array.isArray(fuzzy) && fuzzy.length>0){
        let pick = fuzzy[0];
        if(cleanTopicRaw.includes('definition')) pick = fuzzy.find((k:any)=> k.topic.toLowerCase().includes('definition') || k.caps_code.includes('definition')) || fuzzy[0];
        if(cleanTopicRaw.includes('equation')) pick = fuzzy.find((k:any)=> k.topic.toLowerCase().includes('equation') || k.caps_code.includes('equation')) || fuzzy[0];
        if(cleanTopicRaw.includes('graphs')) pick = fuzzy.find((k:any)=> k.caps_code.includes('graphs')) || fuzzy[0];
        if(cleanTopicRaw.includes('projectile')) pick = fuzzy.find((k:any)=> k.caps_code.includes('projectile')) || fuzzy[0];
        kbArr = [pick];
      }
    }

    if(!Array.isArray(kbArr) || kbArr.length===0){
      console.log("0 KB for",cleanTopicRaw,"->",cleanTopic,subjNorm,kbArr);
      return;
    }

    const kb = kbArr[0];
    console.log("FOUND KB",kb.topic,kb.subject,kb.caps_code,kb.id, "from URL", cleanTopicRaw);

    // 2. 675 ALLOCATION - 5 nodes per caps_topic_id
    const res = await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let nodes:any = await res.json();
    if(!Array.isArray(nodes)){ console.log("NODES BLOCKED",nodes); return; }

    console.log("FOUND NODES",nodes.length,"for",kb.caps_code);
    const seen=new Set();
    nodes = nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
    setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
  })()},[topicId, subjectId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";

  const startEdit = ()=>{
    setEditText(getContent(activeNode));
    setEditing(true);
  };

  const saveEdit = async()=>{
    if(!activeNode) return;
    setSaving(true);
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    try{
      const res = await fetch(`${url}/rest/v1/lesson_nodes?id=eq.${activeNode.id}`,{
        method:"PATCH",
        headers:{
          apikey:key,
          Authorization:`Bearer ${key}`,
          "Content-Type":"application/json",
          Prefer:"return=representation"
        },
        body: JSON.stringify({ 
          content: { ...(typeof activeNode.content==='object'? activeNode.content:{}), body_markdown: editText },
          body_markdown: editText
        })
      });
      const data = await res.json();
      if(Array.isArray(data) && data.length>0){
        setRows(prev=> prev.map(r=> r.id===activeNode.id ? {...r, content:{...r.content, body_markdown: editText}, body_markdown: editText} : r));
        setEditing(false);
        alert("✅ Saved! Live for learners.");
      }else{
        alert("Save failed - check RLS policy for anon: "+JSON.stringify(data));
      }
    }catch(e:any){ alert("Error: "+e.message); }
    setSaving(false);
  };

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:14,textDecoration:"none"}}>← Back</Link>
          {isAdmin ? <span style={{fontSize:10,background:"#00ff88",color:"#000",padding:"4px 8px",borderRadius:8,fontWeight:800}}>ADMIN • Quick Edit ON</span> : <button onClick={()=>{const pw=prompt("Admin key?"); if(pw==="admin123"){localStorage.setItem('isContentAdmin','true'); setIsAdmin(true);}}} style={{fontSize:10,color:"#222",background:"transparent",border:"none"}}>•</button>}
        </div>
        <h1 style={{fontSize:26,fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12,color:rows.length?"#00ff88":"#ff6b35"}}>🔒 {rows.length} NODES • {rows[0]?.caps_topic_id?.slice(0,8)||clean} • {rows.length? "675 Allocated":"0 NODES"}</div>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>{setActive(k); setEditing(false);}} style={{flexShrink:0,padding:"10px 18px",borderRadius:24,border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}
      </div>
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:24,border:"1px solid #252a44"}}>
        <div style={{padding:16,borderBottom:"1px solid #252a44",display:"flex",gap:12,alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:12,background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div>
            <div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:11,color:"#6b7280"}}>{activeNode?.node_type} • {activeNode?.caps_topic_id?.slice(0,8)}</div></div>
          </div>
          {isAdmin && !editing && <button onClick={startEdit} style={{background:"#ff6b35",color:"#fff",border:"none",padding:"8px 14px",borderRadius:12,fontWeight:700,fontSize:12}}>✏️ Quick Edit</button>}
        </div>
        <div style={{padding:20,minHeight:250}}>
          {!editing ? (
            activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {clean}...</div>
          ) : (
            <div>
              <div style={{fontSize:12,color:"#ff6b35",marginBottom:8,fontWeight:700}}>EDITING Node {active} • {activeNode?.id?.slice(0,8)}</div>
              <textarea value={editText} onChange={e=>setEditText(e.target.value)} style={{width:"100%",minHeight:320,background:"#0e0f1a",color:"#e5e7eb",border:"1px solid #ff6b35",borderRadius:12,padding:12,fontSize:14,fontFamily:"monospace"}} />
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <button onClick={saveEdit} disabled={saving} style={{flex:1,background:saving?"#555":"#00ff88",color:"#000",border:"none",padding:"12px",borderRadius:12,fontWeight:800}}>{saving? "Saving...":"💾 Save to Supabase"}</button>
                <button onClick={()=>setEditing(false)} style={{flex:1,background:"#252a44",color:"#fff",border:"none",padding:"12px",borderRadius:12}}>Cancel</button>
              </div>
              <div style={{fontSize:10,color:"#6b7280",marginTop:8}}>Supports **bold** and LaTeX $x^2$ $$\\frac{{a}}{{b}}$$. Saves live.</div>
            </div>
          )}
        </div>
      </div>
      {isAdmin && <div style={{margin:"20px 12px",padding:12,background:"#1a1c2e",borderRadius:12,border:"1px dashed #00ff88",fontSize:11,color:"#6b7280"}}>Admin: add ?admin=1 to stay in edit mode. All 675 nodes editable. Make sure lesson_nodes has RLS policy allowing anon UPDATE or use service_role key for saving.</div>}
    </div>
  )
}
