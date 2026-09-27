"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function QuestionsAdmin(){
  const [qs,setQs]=useState<any[]>([]);
  const [total,setTotal]=useState(0);
  const [search,setSearch]=useState("");
  const [subject,setSubject]=useState("All subjects");
  const [topic,setTopic]=useState("All topics");
  const [difficulty,setDifficulty]=useState("Any difficulty");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      
      // Get total count first - this will show 1083
      const { count } = await supabase.from("questions").select("*", { count: 'exact', head: true });
      setTotal(count || 0);

      let query = supabase.from("questions").select("*").order("created_at",{ascending:false}).limit(200);
      
      if(subject!=="All subjects") query = query.eq("subject", subject);
      if(topic!=="All topics") query = query.eq("topic", topic);
      if(difficulty!=="Any difficulty") query = query.eq("difficulty_l", difficulty);
      if(search) query = query.ilike("question_text", `%${search}%`);
      
      const {data, error} = await query;
      if(error){
        console.error("FETCH ERROR:", error.message);
      }
      setQs(data||[]);
      setLoading(false);
    }
    load();
  },[subject, topic, difficulty, search]);

  const subjects = ["All subjects","Mathematics","Physical Sciences"];
  const difficulties = ["Any difficulty","L1","L2","L3","L4","L5"];

  return(
    <div style={{padding:"16px", background:"#0f1117", minHeight:"100vh", color:"white"}}>
      {/* Content Admin Banner */}
      <div style={{background:"#112116", border:"1px solid #1e3a2a", padding:"12px 16px", borderRadius:"16px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{fontSize:13}}>
          <span style={{color:"#22c55e", fontWeight:800}}>Content Admin mode</span>
          <span style={{color:"#9ca3af"}}> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted. {total > 0 && ` • ${total} questions loaded`}</span>
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
        <select value={topic} onChange={e=>setTopic(e.target.value)} style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          <option>All topics</option>
          {[...new Set(qs.map((q:any)=>q.topic))].slice(0,20).map((t:any)=><option key={t}>{t}</option>)}
        </select>
        <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          {difficulties.map(d=><option key={d}>{d}</option>)}
        </select>
        <select style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          <option>Any review</option><option>approved</option>
        </select>
        <select style={{background:"#1a1d26", border:"1px solid #2a2d3a", color:"#9ca3af", padding:"8px 14px", borderRadius:12, fontSize:13}}>
          <option>Any access</option><option>Free</option>
        </select>
        <div style={{flex:1}}></div>
        <button style={{background:"#8b8bf9", color:"#0f1117", padding:"10px 18px", borderRadius:999, fontWeight:800, fontSize:13, border:"none"}}>+ New question</button>
      </div>

      {/* Table */}
      <div style={{marginTop:16, background:"#1a1d26", borderRadius:20, border:"1px solid #2a2d3a", overflow:"hidden"}}>
        <div style={{display:"grid", gridTemplateColumns:"40px 1fr 160px 70px 70px", padding:"12px 16px", fontSize:11, color:"#6b7280", fontWeight:800, borderBottom:"1px solid #2a2d3a"}}>
          <div><input type="checkbox"/></div><div>QUESTION</div><div>TOPIC PATH • NO TERM</div><div>DIFF</div><div>ACCESS</div>
        </div>
        {loading && <div style={{padding:20, color:"#9ca3af"}}>Loading {total} questions...</div>}
        {!loading && qs.length===0 && total===0 && <div style={{padding:30, textAlign:"center", color:"#ff6b6b"}}>0 questions in DB. Run: SELECT COUNT(*) FROM questions; If 0, re-run Generate. If 1083 in Supabase but 0 here, RLS is blocking anon key - run: ALTER TABLE questions DISABLE ROW LEVEL SECURITY;</div>}
        {!loading && qs.length===0 && total>0 && <div style={{padding:30, textAlign:"center", color:"#9ca3af"}}>No results for current filter. Total in DB: {total} - clear filters.</div>}
        {qs.map((q:any)=>(
          <div key={q.id} style={{display:"grid", gridTemplateColumns:"40px 1fr 160px 70px 70px", padding:"14px 16px", borderBottom:"1px solid #222", alignItems:"center"}}>
            <div><input type="checkbox"/></div>
            <div style={{fontSize:13, paddingRight:10, lineHeight:1.4}}>
              <div>{q.question_text?.slice(0,90)}...</div>
              <div style={{fontSize:11, color:"#6b7280", marginTop:4}}>{q.marks || 3} marks • {q.difficulty_label || q.difficulty_l}</div>
            </div>
            <div style={{fontSize:11, color:"#9ca3af", lineHeight:1.3}}>
              {/* NO TERM MODE */}
              {q.topic_path || `${q.subject} > ${q.unit || q.topic} > ${q.topic}`}
            </div>
            <div style={{fontSize:12, fontWeight:700}}>{q.difficulty_l || q.difficulty || "L3"}</div>
            <div><span style={{background:"#0f2e1a", color:"#22c55e", fontSize:10, padding:"4px 8px", borderRadius:999}}>{q.access || "Free"}</span></div>
          </div>
        ))}
      </div>

      <div style={{marginTop:12, fontSize:12, color:"#6b7280"}}>
        Total: {total} questions in DB • Showing: {qs.length} • NO TERM mode: Subject › Unit › Topic • is_term_based=false
      </div>
    </div>
  )
}
