"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage(){
  const [open,setOpen]=useState(false);
  const [exp,setExp]=useState({content:true,kb:false,exam:false,gen:true});
  const [stats,setStats]=useState({total:0,published:0,inReview:0,drafts:0,needs:0,missingMeta:0,missingNodes:0,missingQ:0,missingPaper:0,math:0,physics:0,mathScaff:0,physScaff:0,mathQ:0,physQ:0});
  const path=usePathname();

  useEffect(()=>{
    async function load(){
      try{
        const { data, count } = await supabase.from("topics").select("id,subject,caps_code,paper_section,nodes,questions,published",{count:"exact"});
        if(!data) return;
        const total = count ?? data.length;
        const published = data.filter((t:any)=>t.published).length;
        const missingMeta = data.filter((t:any)=>!t.caps_code).length;
        const missingNodes = data.filter((t:any)=>!t.nodes || (Array.isArray(t.nodes) && t.nodes.length<5)).length;
        const missingQ = data.filter((t:any)=>!t.questions || t.questions.length<3).length;
        const missingPaper = data.filter((t:any)=>!t.paper_section).length;
        const math = data.filter((t:any)=> (t.subject||"").toLowerCase().includes("math")).length;
        const physics = total - math;
        const mathScaff = data.filter((t:any)=> (t.subject||"").toLowerCase().includes("math") && t.nodes?.length>=5).length;
        const physScaff = data.filter((t:any)=> !(t.subject||"").toLowerCase().includes("math") && t.nodes?.length>=5).length;
        const mathQ = data.filter((t:any)=> (t.subject||"").toLowerCase().includes("math") && t.questions?.length>=3).length;
        const physQ = data.filter((t:any)=> !(t.subject||"").toLowerCase().includes("math") && t.questions?.length>=3).length;
        setStats({total,published,inReview:0,drafts:total-published,needs:0,missingMeta,missingNodes,missingQ,missingPaper,math,physics,mathScaff,physScaff,mathQ,physQ});
      }catch(e){
        console.log(e);
      }
    }
    load();
  },[]);

  const Item=({label,href,active}:{label:string,href:string,active?:boolean})=>(
    <Link href={href} style={{display:"block",padding:"12px 14px",borderRadius:14,background:active?"#6c6cff":"transparent",color:active?"#fff":"#9aa0b3",textDecoration:"none",fontSize:14,fontWeight:active?700:400,margin:"2px 0"}}>{label}</Link>
  );

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div style={{fontSize:13,lineHeight:1.4,paddingRight:12}}>
          <span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted.
        </div>
        <button onClick={()=>setOpen(!open)} style={{minWidth:40,minHeight:40,borderRadius:12,background:"#1a1c2e",border:"1px solid #252a44",color:"#fff",fontSize:18,cursor:"pointer"}}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div style={{margin:"0 12px 12px",background:"#151725",border:"1px solid #1e2238",borderRadius:24,padding:12}}>
          <Item label="⊞ Dashboard" href="/admin" active={path==="/admin"} />
          <div onClick={()=>setExp({...exp,content:!exp.content})} style={{display:"flex",justifyContent:"space-between",padding:"12px 8px",fontWeight:700,cursor:"pointer"}}><span>📄 Content</span><span>{exp.content?"⌄":"›"}</span></div>
          {exp.content && <div style={{marginLeft:12,borderLeft:"1px solid #252a44",paddingLeft:12}}>
            <Item label="Lesson Manager" href="/admin/lessons" />
            <Item label="Live Lessons" href="/admin/live" />
            <Item label="⚡ Review Lessons" href="/admin/review" />
            <Item label="🩺 Content Health" href="/admin/health" />
            <Item label="🧹 Content Cleanup" href="/admin/cleanup" />
            <Item label="Content Coverage" href="/admin/coverage" />
            <Item label="Announcements" href="/admin/announcements" />
          </div>}
          <div onClick={()=>setExp({...exp,kb:!exp.kb})} style={{display:"flex",justifyContent:"space-between",padding:"12px 8px",fontWeight:700,cursor:"pointer"}}><span>📖 Knowledge Base</span><span>{exp.kb?"⌄":"›"}</span></div>
          {exp.kb && <div style={{marginLeft:12,borderLeft:"1px solid #252a44",paddingLeft:12}}>
            <Item label="Knowledge Base" href="/admin/kb" /><Item label="CAPS KB" href="/admin/caps-kb" /><Item label="Source PDFs" href="/admin/pdfs" /><Item label="KB Coverage" href="/admin/kb-coverage" />
          </div>}
          <div style={{padding:"12px 8px",fontWeight:700}}>🎥 Videos</div>
          <div onClick={()=>setExp({...exp,exam:!exp.exam})} style={{display:"flex",justifyContent:"space-between",padding:"12px 8px",fontWeight:700,cursor:"pointer"}}><span>📋 Exam Hub</span><span>{exp.exam?"⌄":"›"}</span></div>
          {exp.exam && <div style={{marginLeft:12,borderLeft:"1px solid #252a44",paddingLeft:12}}>
            <Item label="Questions" href="/admin/questions" /><Item label="Question Bank Audit" href="/admin/bank-audit" /><Item label="Question Coverage" href="/admin/q-coverage" />
          </div>}
          <div onClick={()=>setExp({...exp,gen:!exp.gen})} style={{display:"flex",justifyContent:"space-between",padding:"12px 8px",fontWeight:700,cursor:"pointer"}}><span>🔧 Generation Tools</span><span>{exp.gen?"⌄":"›"}</span></div>
          {exp.gen && <div style={{marginLeft:12,borderLeft:"1px solid #252a44",paddingLeft:12}}>
            <Item label="Factory" href="/admin/factory" active />
            <Item label="Direct Generate" href="/admin/direct" />
            <Item label="Curriculum AI" href="/admin/curriculum-ai" />
            <Item label="Upgrade Lessons" href="/admin/upgrade" />
            <Item label="Content Repair" href="/admin/repair" />
            <Item label="Math Regen" href="/admin/math-regen" />
            <Item label="Math Batch" href="/admin/math-batch" />
            <Item label="Publishing Queue" href="/admin/publish" />
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 8px",fontWeight:700}}><span>☣️ Beta & QA</span><span>›</span></div>
          <Item label="👥 Users" href="/admin/users" />
        </div>
      )}

      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
        <div><h1 style={{fontSize:24,fontWeight:900,margin:0}}>CAPS Content Factory</h1><p style={{color:"#9ca3af",fontSize:12,marginTop:4}}>Command center for Grade 12 curriculum production.</p></div>
        <Link href="/admin/studio" style={{background:"#8b8bff",color:"#fff",padding:"12px 16px",borderRadius:16,textDecoration:"none",fontWeight:800,fontSize:13,textAlign:"center"}}>Open Content<br/>Studio</Link>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:16}}>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16}}><div style={{color:"#9ca3af",fontSize:12}}>Total topics</div><div style={{fontSize:30,fontWeight:900}}>{stats.total}</div></div>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16}}><div style={{color:"#9ca3af",fontSize:12}}>Published</div><div style={{fontSize:30,fontWeight:900}}>{stats.published}</div></div>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16}}><div style={{color:"#9ca3af",fontSize:12}}>In review</div><div style={{fontSize:30,fontWeight:900}}>{stats.inReview}</div></div>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16}}><div style={{color:"#9ca3af",fontSize:12}}>Drafts</div><div style={{fontSize:30,fontWeight:900}}>{stats.drafts}</div></div>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16}}><div style={{color:"#9ca3af",fontSize:12}}>Needs changes</div><div style={{fontSize:30,fontWeight:900}}>{stats.needs}</div></div>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16}}><div style={{color:"#9ca3af",fontSize:12}}>Missing CAPS meta</div><div style={{fontSize:30,fontWeight:900,color:"#facc15"}}>{stats.missingMeta}</div></div>
      </div>

      <div style={{padding:"0 16px"}}>
        <h3 style={{fontSize:16}}>Missing content</h3>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16,marginBottom:12}}><div style={{color:"#9ca3af",fontSize:12}}>Topics missing nodes A-E</div><div style={{fontSize:28,fontWeight:900,color:"#ef4444"}}>{stats.missingNodes}</div></div>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16,marginBottom:12}}><div style={{color:"#9ca3af",fontSize:12}}>Topics with &lt;3 questions</div><div style={{fontSize:28,fontWeight:900,color:"#ef4444"}}>{stats.missingQ}</div></div>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:16,marginBottom:16}}><div style={{color:"#9ca3af",fontSize:12}}>Topics missing paper/section</div><div style={{fontSize:28,fontWeight:900,color:"#ef4444"}}>{stats.missingPaper}</div></div>

        <h3>Completion by subject</h3>
        <div style={{background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:12,fontSize:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.6fr 1fr 0.5fr 0.6fr",color:"#9ca3af",padding:"8px"}}><span>SUBJECT</span><span>TOPICS</span><span>SCAFFOLDED</span><span>≥3 QS</span><span>IN REVIEW</span></div>
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.6fr 1fr 0.5fr 0.6fr",padding:"10px 8px",borderTop:"1px solid #1e2238",fontWeight:700}}><span>Mathematics</span><span style={{textAlign:"center"}}>{stats.math}</span><span style={{textAlign:"center"}}>{stats.mathScaff}</span><span style={{textAlign:"center"}}>{stats.mathQ}</span><span style={{textAlign:"center",color:"#facc15"}}>0</span></div>
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.6fr 1fr 0.5fr 0.6fr",padding:"10px 8px",borderTop:"1px solid #1e2238",fontWeight:700}}><span>Physical Sciences</span><span style={{textAlign:"center"}}>{stats.physics}</span><span style={{textAlign:"center"}}>{stats.physics - 110}</span><span style={{textAlign:"center"}}>{stats.physQ}</span><span style={{textAlign:"center",color:"#facc15"}}>0</span></div>
        </div>
      </div>
    </div>
  )
}
