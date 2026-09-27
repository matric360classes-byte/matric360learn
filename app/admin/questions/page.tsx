"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function QuestionsAdmin(){
  const [qs,setQs]=useState<any[]>([]);
  const [search,setSearch]=useState("");
  const [subject,setSubject]=useState("All subjects");
  const [topic,setTopic]=useState("All topics");
  const [difficulty,setDifficulty]=useState("Any difficulty");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      let query = supabase.from("questions").select("*").order("created_at",{ascending:false}).limit(100);
      if(subject!=="All subjects") query = query.eq("subject", subject);
      if(search) query = query.ilike("question_text", `%${search}%`);
      const {data} = await query;
      setQs(data||[]);
      setLoading(false);
    }
    load();
  },[subject, search]);

  const subjects = ["All subjects","Mathematics","Physical Sciences"];

  return(
    <div style={{padding:"16px", background:"#0f1117", minHeight:"100vh", color:"white"}}>
      {/* Content Admin Banner */}
      <div style={{background:"#112116", border:"1px solid #1e3a2a", padding:"12px 16px", borderRadius:"16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontSize:13}}>
          <span style={{color:"#22c55e", fontWeight:800}}>Content Admin mode</span>
          <span style={{color:"#9ca3af"}}> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted.</span>
        </div>
        <div style={{fontSize:18}}>☰</div>
      </div>

      {/* Filters */}
      <div style={{marginTop:14, display:"flex", gap:8, flexWrap:"wrap"}}>
        <div style={{flex:1, minWidth:200, background:"#1a1d26", borderRadius:12, padding:"10px 12px", display:"flex", alignItems:"center", gap:8, border:"1px solid #2a2d3a"}}>
          <span style={{opacity:0.5}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search question text..." style={{background:"transparent", border:"none", color:"white", width:"100%", outline:"none"}}/>
        </div>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"white", padding:"10px 16px", borderRadius:12}}>
          {subjects.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{marginTop:10, display:"flex", gap:8, flexWrap:"wrap"}}>
        <select style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          <option>All topics</option>
        </select>
        <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          <option>Any difficulty</option><option>L1</option><option>L2</option><option>L3</option>
        </select>
        <select style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          <option>Any review</option>
        </select>
        <select style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          <option>Any access</option>
        </select>
        <div style={{flex:1}}></div>
        <button style={{background:"#8b8bf9", color:"#0f1117", padding:"10px 18px", borderRadius:999, fontWeight:800, fontSize:13, border:"none"}}>+ New question</button>
      </div>

      {/* Table */}
      <div style={{marginTop:16, background:"#1a1d26", borderRadius:20, border:"1px solid #2a2d3a", overflow:"hidden"}}>
        <div style={{display:"grid", gridTemplateColumns:"40px 1fr 140px 60px 70px", padding:"12px 16px", fontSize:11, color:"#6b7280", fontWeight:800, borderBottom:"1px solid #2a2d3a"}}>
          <div><input type="checkbox"/></div><div>QUESTION</div><div>TOPIC</div><div>DIFF</div><div>ACCESS</div>
        </div>
        {loading && <div style={{padding:20, color:"#9ca3af"}}>Loading questions...</div>}
        {!loading && qs.length===0 && <div style={{padding:30, textAlign:"center", color:"#9ca3af"}}>No questions yet. Click "Generate Questions Bank (No Term)" on your Generate page. 0 / 45 = none saved because table didn't exist.</div>}
        {qs.map((q:any)=>(
          <div key={q.id} style={{display:"grid", gridTemplateColumns:"40px 1fr 140px 60px 70px", padding:"14px 16px", borderBottom:"1px solid #222", alignItems:"center"}}>
            <div><input type="checkbox"/></div>
            <div style={{fontSize:13, paddingRight:10, lineHeight:1.4}}>{q.question_text?.slice(0,80)}...</div>
            <div style={{fontSize:11, color:"#9ca3af"}}>{q.subject}<br/>› Grade 12<br/>› {q.topic}</div>
            <div style={{fontSize:12}}>{q.difficulty}</div>
            <div><span style={{background:"#0f2e1a", color:"#22c55e", fontSize:10, padding:"4px 8px", borderRadius:999}}>{q.access}</span></div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12, fontSize:12, color:"#6b7280"}}>
        Total: {qs.length} questions • NO TERM mode: Subject › Grade 12 › Topic
      </div>
    </div>
  )
}
