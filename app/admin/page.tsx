"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import MathBatch from "@/components/admin/MathBatch";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

const ALLOWED = ["mathematics","pure maths","maths","physical sciences","physical science"];
const isAllowed = (s:string)=> ALLOWED.some(a=> (s||"").toLowerCase().includes(a));

export default function AdminPage(){
  const router = useRouter();
  const [menuOpen,setMenuOpen]=useState(false);
  const [sections,setSections]=useState<any>({content:false,kb:false,exam:false,gen:false});
  const toggle=(k:string)=>setSections((s:any)=>({...s,[k]:!s[k]}));
  const [stats,setStats]=useState<any>({total:0,published:0,inReview:0,drafts:0,needsChanges:0,missingCaps:0,missingNodes:0,lessThan3Q:0,missingPaper:0,bySubject:[]});
  const [activeView,setActiveView]=useState("factory"); // NEW

  useEffect(()=>{(async()=>{
    const {data:all} = await supabase.from("topic_knowledge").select("*");
    const topics:any[] = (all||[]).filter((t:any)=>isAllowed(t.subject));
    const total = topics.length;
    let qCounts:any={},lessThan3Q=total,missingNodes=total;
    try{const {data:qs}=await supabase.from("questions").select("topic_id"); if(qs){qs.forEach((q:any)=>{qCounts[q.topic_id]=(qCounts[q.topic_id]||0)+1}); lessThan3Q=topics.filter((t:any)=>(qCounts[t.id]||0)<3).length;}}catch{}
    try{const {data:ns}=await supabase.from("lesson_previews").select("topic_id"); if(ns){const s=new Set(ns.map((n:any)=>n.topic_id)); missingNodes=topics.filter((t:any)=>!s.has(t.id)).length;}}catch{}
    const bySub:any={}; topics.forEach((t:any)=>{const key=t.subject?.toLowerCase().includes("physical")?"Physical Sciences":"Mathematics"; if(!bySub[key])bySub[key]={subject:key,topics:0,scaffolded:0,ge3:0,review:0}; bySub[key].topics++; if(t.is_scaffolded)bySub[key].scaffolded++; if((qCounts[t.id]||0)>=3)bySub[key].ge3++; if(t.status==="in_review")bySub[key].review++;});
    setStats({total,published:topics.filter((t:any)=>t.status==="published"||t.is_published).length,inReview:topics.filter((t:any)=>t.status==="in_review").length,drafts:topics.filter((t:any)=>t.status==="draft").length,needsChanges:topics.filter((t:any)=>t.status==="needs_changes").length,missingCaps:topics.filter((t:any)=>!t.caps_code&&!t.caps_topic).length,missingNodes,lessThan3Q,missingPaper:topics.filter((t:any)=>!t.paper&&!t.section).length,bySubject:Object.values(bySub)});
  })()},[]);

  const Item=({label,path,action}:{label:string,path:string,action?:()=>void})=>(<div onClick={()=>{setMenuOpen(false); if(action) action(); else router.push(path)}} style={{padding:"10px 0 10px 16px", color:"#9ca3af", cursor:"pointer"}}>{label}</div>);

  return (
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui", paddingBottom:80}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:12, position:"sticky", top:0, background:"#0f0f14", zIndex:5}}>
        <div style={{display:"flex", gap:10, alignItems:"center"}}><button onClick={()=>setMenuOpen(!menuOpen)} style={{width:40,height:40, background:"#1e1e28", borderRadius:12, border:"none", color:"white"}}>☰</button><b>Matric360</b></div>
        <div style={{display:"flex", gap:8}}><span style={{background:"#1e1e28", padding:"6px 12px", borderRadius:20, fontSize:12}}>🛡️ Content</span><span style={{background:"#1e1e28", padding:"6px 12px", borderRadius:20, fontSize:12, color:"#22c55e"}}>📶 Online</span></div>
      </div>

      {menuOpen && (
        <div style={{margin:"0 12px", background:"#181821", borderRadius:20, padding:12, border:"1px solid #222"}}>
          <div style={{background:"#162216", borderRadius:16, padding:12, display:"flex", justifyContent:"space-between", marginBottom:12}}><div style={{fontSize:13}}><span style={{color:"#22c55e", fontWeight:"bold"}}>Content Admin mode</span><span style={{color:"#9ca3af"}}> — Pure Maths & Physical Sciences only</span></div><button onClick={()=>setMenuOpen(false)} style={{background:"#1e1e28", border:"none", color:"white", borderRadius:50, width:32, height:32}}>✕</button></div>
          <div onClick={()=>{setMenuOpen(false); setActiveView("factory")}} style={{padding:10, cursor:"pointer"}}>⊞ Dashboard</div>
          <div onClick={()=>toggle("content")} style={{display:"flex", justifyContent:"space-between", padding:10, fontWeight:"bold"}}><span>📄 Content</span><span>{sections.content?"∨":">"}</span></div>
          {sections.content && <div style={{borderLeft:"1px solid #222", marginLeft:12, paddingLeft:12}}><Item label="Lesson Manager" path="/admin/lessons"/><Item label="Live Lessons" path="/admin/live"/><Item label="⚡ Review Lessons" path="/admin/review"/><Item label="🩺 Content Health" path="/admin/health"/><Item label="🧹 Content Cleanup" path="/admin/cleanup"/><Item label="Content Coverage" path="/admin/coverage"/><Item label="Announcements" path="/admin/announcements"/></div>}
          <div onClick={()=>toggle("kb")} style={{display:"flex", justifyContent:"space-between", padding:10, fontWeight:"bold"}}><span>📖 Knowledge Base</span><span>{sections.kb?"∨":">"}</span></div>
          {sections.kb && <div style={{borderLeft:"1px solid #222", marginLeft:12, paddingLeft:12}}><Item label="Knowledge Base" path="/admin/kb"/><Item label="CAPS KB" path="/admin/caps-kb"/><Item label="Source PDFs" path="/admin/pdfs"/><Item label="KB Coverage" path="/admin/kb-coverage"/></div>}
          <div onClick={()=>{setMenuOpen(false); router.push("/admin/videos")}} style={{padding:10, cursor:"pointer"}}>🎥 Videos</div>
          <div onClick={()=>toggle("exam")} style={{display:"flex", justifyContent:"space-between", padding:10, fontWeight:"bold"}}><span>📋 Exam Hub</span><span>{sections.exam?"∨":">"}</span></div>
          {sections.exam && <div style={{borderLeft:"1px solid #222", marginLeft:12, paddingLeft:12}}><Item label="Questions" path="/admin/questions"/><Item label="Question Bank Audit" path="/admin/qb-audit"/><Item label="Question Coverage" path="/admin/q-coverage"/></div>}
          <div onClick={()=>toggle("gen")} style={{display:"flex", justifyContent:"space-between", padding:10, fontWeight:"bold"}}><span>🔧 Generation Tools</span><span>{sections.gen?"∨":">"}</span></div>
          {sections.gen && <div style={{borderLeft:"1px solid #222", marginLeft:12, paddingLeft:12}}><div onClick={()=>{setMenuOpen(false); setActiveView("factory")}} style={{background: activeView==="factory"? "#8b7cf8":"transparent", color: activeView==="factory"? "black":"#9ca3af", padding:"8px 16px", borderRadius:20, fontWeight:"bold", width:"fit-content", cursor:"pointer"}}>Factory</div><Item label="Direct Generate" path="/admin/generate"/><Item label="Curriculum AI" path="/admin/curriculum"/><Item label="Upgrade Lessons" path="/admin/upgrade"/><Item label="Content Repair" path="/admin/repair"/><Item label="Math Regen" path="/admin/math-regen"/><Item label="Math Batch" path="" action={()=>{setMenuOpen(false); setActiveView("math-batch")}}/><Item label="Publishing Queue" path="/admin/publish"/></div>}
        </div>
      )}

      <div style={{padding:16}}>
        {activeView==="math-batch"? <MathBatch /> : (
        <>
          {!menuOpen && <div style={{background:"#162216", border:"1px solid #2a3a2a", padding:14, borderRadius:16, marginBottom:16, display:"flex", justifyContent:"space-between"}}><div style={{fontSize:13}}><span style={{color:"#22c55e", fontWeight:"bold"}}>Content Admin mode</span><span style={{color:"#9ca3af"}}> — Pure Maths & Physical Sciences only</span></div><button onClick={()=>setMenuOpen(true)} style={{background:"#1e1e28", border:"none", color:"white", borderRadius:10, padding:"4px 10px"}}>☰</button></div>}
          <div style={{display:"flex", justifyContent:"space-between"}}><div><h1 style={{fontSize:24, fontWeight:"800", margin:0}}>CAPS Content Factory</h1><p style={{color:"#9ca3af", fontSize:12}}>Pure Maths & Physical Sciences - launch subjects</p></div><button onClick={()=>router.push("/admin/studio")} style={{background:"#8b7cf8", color:"black", fontWeight:"800", padding:"10px 16px", borderRadius:14, border:"none"}}>Open<br/>Content<br/>Studio</button></div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:16}}>
            <div style={{background:"#1c1c24", padding:16, borderRadius:20}}><div>📖</div><div style={{color:"#9ca3af", fontSize:12}}>Total topics</div><div style={{fontSize:26, fontWeight:"800"}}>{stats.total}</div></div>
            <div style={{background:"#1c1c24", padding:16, borderRadius:20}}><div>✅</div><div style={{color:"#9ca3af", fontSize:12}}>Published</div><div style={{fontSize:26, fontWeight:"800"}}>{stats.published}</div></div>
            <div style={{background:"#1c1c24", padding:16, borderRadius:20}}><div>🕒</div><div style={{color:"#9ca3af", fontSize:12}}>In review</div><div style={{fontSize:26, fontWeight:"800"}}>{stats.inReview}</div></div>
            <div style={{background:"#1c1c24", padding:16, borderRadius:20}}><div>☰</div><div style={{color:"#9ca3af", fontSize:12}}>Drafts</div><div style={{fontSize:26, fontWeight:"800"}}>{stats.drafts}</div></div>
            <div style={{background:"#1c1c24", padding:16, borderRadius:20}}><div>⚠️</div><div style={{color:"#9ca3af", fontSize:12}}>Needs changes</div><div style={{fontSize:26, fontWeight:"800"}}>{stats.needsChanges}</div></div>
            <div style={{background:"#1c1c24", padding:16, borderRadius:20}}><div>✨</div><div style={{color:"#9ca3af", fontSize:12}}>Missing CAPS meta</div><div style={{fontSize:26, fontWeight:"800"}}>{stats.missingCaps}</div></div>
          </div>
          <h3 style={{marginTop:20}}>Missing content</h3>
          <div style={{background:"#1c1c24", padding:16, borderRadius:20, marginBottom:10}}><div style={{color:"#9ca3af", fontSize:12}}>Topics missing nodes A–E</div><div style={{color:"#ef4444", fontSize:28, fontWeight:"800"}}>{stats.missingNodes}</div></div>
          <div style={{background:"#1c1c24", padding:16, borderRadius:20, marginBottom:10}}><div style={{color:"#9ca3af", fontSize:12}}>Topics with &lt;3 questions</div><div style={{color:"#ef4444", fontSize:28, fontWeight:"800"}}>{stats.lessThan3Q}</div></div>
          <div style={{background:"#1c1c24", padding:16, borderRadius:20, marginBottom:20}}><div style={{color:"#9ca3af", fontSize:12}}>Topics missing paper/section</div><div style={{color:"#ef4444", fontSize:28, fontWeight:"800"}}>{stats.missingPaper}</div></div>
          <h3>Completion by subject</h3>
          <div style={{background:"#1c1c24", borderRadius:20, overflow:"hidden"}}>
            <div style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 0.7fr 0.7fr", padding:12, color:"#9ca3af", fontSize:11, fontWeight:"bold"}}><span>SUBJECT</span><span>TOPICS</span><span>SCAFFOLDED</span><span>≥3 QS</span><span>IN REVIEW</span></div>
            {stats.bySubject.map((r:any)=>(<div key={r.subject} style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr 0.7fr 0.7fr", padding:12, borderTop:"1px solid #222"}}><span style={{fontWeight:"bold"}}>{r.subject}</span><span>{r.topics}</span><span>{r.scaffolded}</span><span>{r.ge3}</span><span style={{color:"#fbbf24"}}>{r.review}</span></div>))}
          </div>
        </>
        )}
      </div>
    </div>
  );
}
