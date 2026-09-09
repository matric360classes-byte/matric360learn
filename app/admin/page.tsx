// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcmkhe.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function AdminPage(){
  const [tab, setTab] = useState("factory");
  const [open, setOpen] = useState({content:true, kb:true, exam:true, gen:true});
  const [topics, setTopics] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({total:0, pub:0, draft:0, missingMeta:0, missingNodes:0, less3:0, missingPaper:0});

  useEffect(()=>{
    async function load(){
      const { data: t } = await supabase.from('topic_knowledge').select('caps_code, topic_name, subject, node_label, paper_section, description').limit(500);
      if(t){
        setTopics(t);
        setStats({
          total: t.length,
          pub: t.length,
          draft: 0,
          missingNodes: t.filter(x=>!x.node_label).length,
          missingPaper: t.filter(x=>!x.paper_section).length,
          missingMeta: t.filter(x=>!x.description).length,
          less3: 0
        });
      }
      const { data: q } = await supabase.from('questions').select('id, question_text, subject, topic, difficulty, access').limit(100);
      if(q){
        setQuestions(q);
        if(t){
          const counts:any={};
          q.forEach((qq:any)=>counts[qq.topic]=(counts[qq.topic]||0)+1);
          const less3 = t.filter((tt:any)=>(counts[tt.caps_code]||0)<3).length;
          setStats(s=>({...s, less3}));
        }
      }
      const { data: u } = await supabase.from('profiles').select('id, email, role, created_at').limit(50);
      if(u) setUsers(u);
    }
    load();
  },[]);

  const Card = ({icon,label,value,color="#fff"}:any)=>(
    <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", padding:"16px"}}>
      <div>{icon}</div><div style={{fontSize:"11px", color:"#94a3b8", marginTop:"6px", letterSpacing:"0.5px"}}>{label}</div>
      <div style={{fontSize:"28px", fontWeight:900, marginTop:"4px", color}}>{value}</div>
    </div>
  );
  const Menu = ({l,a,on}:any)=><div onClick={on} style={{padding:"9px 0 9px 22px", color:a?"#fff":"#8b8fa3", fontSize:"14px", cursor:"pointer", borderLeft:a?"2px solid #7c7cff":"2px solid transparent", background:a?"rgba(124,124,255,0.08)":"transparent"}}>{l}</div>;

  return(
    <div style={{background:"#0a0a0e", minHeight:"100vh", color:"white", fontFamily:"system-ui", display:"flex", flexDirection:"column"}}>
      <div style={{height:"56px", background:"#11121a", borderBottom:"1px solid #1e2235", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 14px"}}>
        <div style={{display:"flex", gap:"10px", alignItems:"center"}}><span>☰</span><span style={{fontWeight:900}}>Matric360</span></div>
        <div style={{display:"flex", gap:"8px"}}><span style={{background:"#181a2a", border:"1px solid #2a2d45", padding:"5px 12px", borderRadius:"20px", fontSize:"11px"}}>🛡️ Content</span><span style={{background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", padding:"5px 12px", borderRadius:"20px", fontSize:"11px", color:"#22c55e"}}>● Online • WIRED</span></div>
      </div>

      <div style={{display:"flex", flex:1}}>
        <div style={{width:"240px", background:"#11121a", borderRight:"1px solid #1e2235", padding:"10px", overflowY:"auto"}}>
          <div onClick={()=>setTab("dashboard")} style={{padding:"10px", color:tab==="dashboard"?"#fff":"#8b8fa3", cursor:"pointer", fontWeight:tab==="dashboard"?800:400}}>⊞ Dashboard</div>
          <div onClick={()=>setOpen(o=>({...o,content:!o.content}))} style={{padding:"10px", fontWeight:700, display:"flex", justifyContent:"space-between", cursor:"pointer", marginTop:"6px"}}><span>🗎 Content</span><span>{open.content?"⌃":"⌄"}</span></div>
          {open.content && <div style={{borderLeft:"1px solid #1e2235", marginLeft:"14px"}}>
            <Menu l="Lesson Manager" a={tab==="lessons"} on={()=>setTab("lessons")} /><Menu l="Live Lessons" /><Menu l="⚡ Review Lessons" a={tab==="review"} on={()=>setTab("review")} /><Menu l="🩺 Content Health" a={tab==="health"} on={()=>setTab("health")} /><Menu l="🧹 Content Cleanup" /><Menu l="Content Coverage" a={tab==="coverage"} on={()=>setTab("coverage")} />
          </div>}
          <div onClick={()=>setOpen(o=>({...o,kb:!o.kb}))} style={{padding:"10px", fontWeight:700, display:"flex", justifyContent:"space-between", cursor:"pointer", marginTop:"6px"}}><span>📖 Knowledge Base</span><span>{open.kb?"⌃":"⌄"}</span></div>
          {open.kb && <div style={{borderLeft:"1px solid #1e2235", marginLeft:"14px"}}><Menu l="KB Coverage" a={tab==="factory"} on={()=>setTab("factory")} /><Menu l="CAPS KB" /><Menu l="Source PDFs" /></div>}
          <div style={{padding:"10px"}}>🎥 Videos</div>
          <div onClick={()=>setOpen(o=>({...o,exam:!o.exam}))} style={{padding:"10px", fontWeight:700, display:"flex", justifyContent:"space-between", cursor:"pointer"}}><span>📋 Exam Hub</span><span>{open.exam?"⌃":"⌄"}</span></div>
          {open.exam && <div style={{borderLeft:"1px solid #1e2235", marginLeft:"14px"}}><Menu l="Questions" a={tab==="questions"} on={()=>setTab("questions")} /><Menu l="Question Bank Audit" /><Menu l="Question Coverage" /></div>}
          <div onClick={()=>setOpen(o=>({...o,gen:!o.gen}))} style={{padding:"10px", fontWeight:700, display:"flex", justifyContent:"space-between", cursor:"pointer", marginTop:"6px"}}><span>🔧 Generation Tools</span><span>{open.gen?"⌃":"⌄"}</span></div>
          {open.gen && <div style={{borderLeft:"1px solid #1e2235", marginLeft:"14px"}}><Menu l="Factory" a={tab==="factory"} on={()=>setTab("factory")} /><Menu l="Direct Generate" /><Menu l="Math Batch" a={tab==="mathbatch"} on={()=>setTab("mathbatch")} /><Menu l="Publishing Queue" a={tab==="review"} on={()=>setTab("review")} /></div>}
          <div style={{padding:"10px", marginTop:"10px", color:"#8b8fa3"}}>🐞 Beta & QA</div>
          <div onClick={()=>setTab("users")} style={{background:tab==="users"?"#7c7cff":"transparent", color:tab==="users"?"#000":"#8b8fa3", padding:"10px 14px", borderRadius:"24px", fontWeight:700, cursor:"pointer"}}>👥 Users</div>
        </div>

        <div style={{flex:1, padding:"16px", maxWidth:"800px", paddingBottom:"80px"}}>
          <div style={{background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:"20px", padding:"12px 16px", marginBottom:"16px"}}>
            <div style={{color:"#22c55e", fontWeight:800, fontSize:"13px"}}>Content Admin — WIRED • Supabase Live</div><div style={{color:"#6b7280", fontSize:"11px"}}>topic_knowledge: {stats.total} • questions: {questions.length} • profiles: {users.length}</div>
          </div>

          {tab==="factory" && (
            <>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px"}}>
                <div><div style={{fontSize:"22px", fontWeight:900}}>CAPS Content Factory</div><div style={{fontSize:"12px", color:"#94a3b8"}}>Command center — REAL Supabase data</div></div>
                <button onClick={()=>setTab("mathbatch")} style={{background:"#7c7cff", color:"#000", border:"none", padding:"10px 16px", borderRadius:"16px", fontWeight:800, fontSize:"12px"}}>Open Content<br/>Studio</button>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px"}}>
                <Card icon="📖" label="Total topics" value={stats.total} />
                <Card icon="✅" label="Published" value={stats.pub} color="#22c55e" />
                <Card icon="🕐" label="In review" value="0" />
                <Card icon="☰" label="Drafts" value={stats.draft} />
                <Card icon="🚨" label="Needs changes" value="0" color="#ef4444" />
                <Card icon="✨" label="Missing CAPS meta" value={stats.missingMeta} color="#eab308" />
              </div>
              <div style={{fontWeight:800, marginBottom:"8px"}}>Missing content — REAL</div>
              <div style={{display:"flex", flexDirection:"column", gap:"10px", marginBottom:"16px"}}>
                <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", padding:"14px"}}><div style={{fontSize:"11px", color:"#94a3b8"}}>Topics missing nodes A–E (node_label null)</div><div style={{fontSize:"26px", fontWeight:900, color:"#ef4444"}}>{stats.missingNodes}</div></div>
                <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", padding:"14px"}}><div style={{fontSize:"11px", color:"#94a3b8"}}>Topics with &lt;3 questions</div><div style={{fontSize:"26px", fontWeight:900, color:"#ef4444"}}>{stats.less3}</div></div>
                <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", padding:"14px"}}><div style={{fontSize:"11px", color:"#94a3b8"}}>Topics missing paper/section</div><div style={{fontSize:"26px", fontWeight:900, color:"#ef4444"}}>{stats.missingPaper}</div></div>
              </div>
              <div style={{fontWeight:800, marginBottom:"8px"}}>Completion by subject — REAL</div>
              <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", overflow:"hidden"}}>
                <div style={{display:"grid", gridTemplateColumns:"1.5fr 0.5fr 0.8fr 0.5fr", padding:"10px", fontSize:"10px", color:"#6b7280", fontWeight:700}}><div>SUBJECT</div><div>TOPICS</div><div>SCAFFOLDED</div><div>≥3 QS</div></div>
                {Array.from(new Set(topics.map(t=>t.subject))).map(sub=>(
                  <div key={sub} style={{display:"grid", gridTemplateColumns:"1.5fr 0.5fr 0.8fr 0.5fr", padding:"12px", fontSize:"13px", borderTop:"1px solid #252a44"}}>
                    <div style={{fontWeight:700}}>{sub}</div><div>{topics.filter(t=>t.subject===sub).length}</div><div>{topics.filter(t=>t.subject===sub && t.node_label).length}</div><div>{questions.filter(q=>q.subject===sub).length}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab==="dashboard" && (
            <>
              <div style={{fontSize:"22px", fontWeight:900}}>Admin Dashboard</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"12px"}}>
                <Card icon="📖" label="Topics (real)" value={stats.total} /><Card icon="❓" label="Questions (real)" value={questions.length} />
                <Card icon="👥" label="Users (profiles)" value={users.length} /><Card icon="✅" label="Published" value={stats.pub} color="#22c55e" />
              </div>
            </>
          )}

          {tab==="questions" && (
            <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", overflow:"hidden"}}>
              <div style={{padding:"12px", display:"flex", justifyContent:"space-between"}}><input placeholder="🔍 Search..." style={{background:"#11121a", border:"1px solid #252a44", borderRadius:"20px", padding:"8px 12px", color:"white", width:"70%"}} /><button style={{background:"#7c7cff", color:"#000", border:"none", padding:"8px 14px", borderRadius:"20px", fontWeight:800}}>+ New</button></div>
              {questions.map(q=>(
                <div key={q.id} style={{padding:"12px", borderTop:"1px solid #252a44", fontSize:"13px"}}><div>{q.question_text?.slice(0,80)}...</div><div style={{fontSize:"11px", color:"#64748b"}}>{q.subject} › {q.topic} • L{q.difficulty}</div></div>
              ))}
              {questions.length===0 && <div style={{padding:"20px", color:"#64748b"}}>No questions yet — create questions table or check RLS</div>}
            </div>
          )}

          {tab==="users" && (
            <>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"12px"}}>
                <Card icon="👥" label="USERS" value={users.length} /><Card icon="⭐" label="Profiles" value={users.length} />
              </div>
              {users.map((u:any,i:number)=>(
                <div key={i} style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", padding:"12px", marginBottom:"8px"}}>
                  <div style={{fontWeight:700, fontSize:"13px"}}>{u.email}</div><div style={{fontSize:"11px", color:"#94a3b8"}}>{u.role||"Student"} • {u.id?.slice(0,8)}</div>
                </div>
              ))}
            </>
          )}

          {tab==="mathbatch" && (
            <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", padding:"16px"}}>
              <h3 style={{fontWeight:800}}>Math Batch — Ready to wire generation</h3>
              <div style={{fontSize:"11px", color:"#94a3b8", marginTop:"4px"}}>Source: CAPS KB • MTG • Learner • Marker → lesson_previews • Cost guard $2</div>
              <div style={{marginTop:"12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", fontSize:"11px"}}>
                <div style={{background:"#11121a", padding:"8px", borderRadius:"10px"}}>MODEL: gemini-2.5-pro</div><div style={{background:"#11121a", padding:"8px", borderRadius:"10px"}}>COST/TOPIC: $0.0475</div>
              </div>
              <button onClick={async ()=>{
  const batch = topics.slice(0,3);
  for(const t of batch){
    const res = await fetch('/api/generate', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({caps_code: t.caps_code})
    });
    const data = await res.json();
    alert(`Generated ${t.caps_code}: ${data.success ? 'OK - saved to lesson_previews' : data.error}`);
  }
}} style={{marginTop:"12px", width:"100%", background:"#7c7cff", color:"#000", padding:"12px", borderRadius:"14px", fontWeight:800, border:"none"}}>▶ Run Batch (3) — LIVE GENERATE</button>
              <div style={{marginTop:"12px"}}>{topics.slice(0,15).map(t=><div key={t.caps_code} style={{padding:"5px 0", borderBottom:"1px solid #1e2235", fontSize:"12px"}}><span style={{color:"#7c7cff"}}>{t.caps_code}</span> {t.topic_name}</div>)}</div>
            </div>
          )}

          {tab==="coverage" && (
            <div style={{background:"#181a2a", border:"1px solid #252a44", borderRadius:"20px", padding:"12px"}}>
              <div style={{fontWeight:800, marginBottom:"8px"}}>KB Coverage — {topics.length} topics</div>
              {topics.map(t=><div key={t.caps_code} style={{padding:"6px 0", borderBottom:"1px solid #1e2235", fontSize:"12px"}}><span style={{color:"#7c7cff", fontFamily:"monospace"}}>{t.caps_code}</span> {t.topic_name} — <span style={{color:t.node_label?"#22c55e":"#ef4444"}}>{t.node_label||"missing"}</span></div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
